"use client";
import { Formik } from "formik";
import RoleForm from "./form-components/RoleForm";
import Select from "./bootstrap/Select";
import { useDiscordToken, useFormatsWhere } from "@/utils/hooks";
import { leaderboards } from "@/utils/maplistUtils";
import AddableField from "./AddableField";
import { FormikContext } from "@/contexts";
import { getRepeatedIndexes, validateAchievableRole } from "@/utils/validators";
import {
  getValidServerDropdownRoles,
  updateAchievementRoles,
} from "@/server/maplistRequests.client";
import ErrorToast from "./ErrorToast";
import { useEffect, useState } from "react";
import { revalidateRoles } from "@/server/revalidations";
import LazyToast from "../transitions/LazyToast";
import { hexToInt, intToHex } from "@/utils/functions";
import ToastSuccess from "./ToastSuccess";

const emptyRole = {
  threshold: 1,
  clr_border: "#000000",
  clr_inner: "#ffffff",
  tooltip_description: "",
  name: "",
  linked_roles: [],
};

export default function FormEditRoles({ roles }) {
  const accessToken = useDiscordToken();
  const [guilds, setGuilds] = useState(null);
  const [success, setSuccess] = useState(false);
  const allowedFormats = useFormatsWhere("edit:achievement_roles", {
    full: true,
  });

  const validate = (values) => {
    const errors = {};

    if (values.firstPlaceRole) {
      const roleErrors = validateAchievableRole(values.firstPlaceRole, {
        isFirstPlace: true,
      });
      for (const errK of Object.keys(roleErrors)) {
        errors[`firstPlaceRole.${errK}`] = roleErrors[errK];
      }
    }

    for (let i = 0; i < values.roles.length; i++) {
      const baseKey = `roles[${i}]`;
      const roleErrors = validateAchievableRole(values.roles[i]);
      for (const errK of Object.keys(roleErrors)) {
        errors[`${baseKey}.${errK}`] = roleErrors[errK];
      }
    }

    for (const idx of getRepeatedIndexes(
      values.roles.map((rl) => rl.threshold)
    )) {
      errors[`roles[${idx}].threshold`] = "Duplicate threshold";
    }

    const linkedRoles = [];
    for (let i = 0; i < values.roles.length; i++) {
      for (let j = 0; j < values.roles[i].linked_roles.length; j++) {
        linkedRoles.push({
          i,
          j,
          role_id: values.roles[i].linked_roles[j].role_id,
        });
      }
    }
    for (const idx of getRepeatedIndexes(linkedRoles.map((lr) => lr.role_id))) {
      const { i, j } = linkedRoles[idx];
      errors[`roles[${i}].linked_roles[${j}].role_id`] = "Duplicate role";
    }

    return errors;
  };

  const handleSubmit = async (values, { setErrors }) => {
    const payloadRoles = values.roles.map((rl) => ({
      threshold: rl.threshold | 0,
      for_first: false,
      tooltip_description: rl.tooltip_description.length
        ? rl.tooltip_description
        : null,
      name: rl.name,
      clr_border: hexToInt(rl.clr_border),
      clr_inner: hexToInt(rl.clr_inner),
      linked_roles: rl.linked_roles,
    }));

    let firstPlaceIdx = null;
    if (values.firstPlaceRole) {
      firstPlaceIdx = payloadRoles.length;
      payloadRoles.push({
        threshold: 0,
        for_first: true,
        tooltip_description: values.firstPlaceRole.tooltip_description.length
          ? values.firstPlaceRole.tooltip_description
          : null,
        name: values.firstPlaceRole.name,
        clr_border: hexToInt(values.firstPlaceRole.clr_border),
        clr_inner: hexToInt(values.firstPlaceRole.clr_inner),
        linked_roles: values.firstPlaceRole.linked_roles,
      });
    }

    const result = await updateAchievementRoles(
      accessToken.access_token,
      values.lb_format,
      values.lb_type,
      payloadRoles
    );
    if (result && Object.keys(result.errors).length) {
      const toDeleteKeys = [];
      if (firstPlaceIdx !== null) {
        for (const key of Object.keys(result.errors)) {
          if (key.startsWith(`roles[${firstPlaceIdx}]`)) {
            result.errors[
              key.replace(`roles[${firstPlaceIdx}]`, "firstPlaceRole")
            ] = result.errors[key];
            toDeleteKeys.push(key);
          }
        }
      }
      for (const key of toDeleteKeys) delete result.errors[key];
      setErrors(result.errors);
      return;
    }

    setSuccess(true);
    revalidateRoles();
  };

  const selectCurrentRoles = (lbFormat, lbValue) => {
    return roles
      .filter(
        ({ lb_format, lb_type }) =>
          lb_format === lbFormat && lb_type === lbValue
      )
      .map((rl, idx) => ({
        ...rl,
        count: -idx,
        tooltip_description: rl.tooltip_description || "",
        clr_border: intToHex(rl.clr_border),
        clr_inner: intToHex(rl.clr_inner),
        linked_roles: rl.linked_roles.map((lrl, i) => ({
          ...lrl,
          count: -i - 1,
        })),
      }));
  };

  const initialLbformat = allowedFormats?.[0];
  const initRoles = selectCurrentRoles(initialLbformat.id, "points");

  useEffect(() => {
    const execute = async () => {
      setGuilds(await getValidServerDropdownRoles(accessToken.access_token));
    };
    execute();
  }, []);

  if (initialLbformat === undefined) return null;

  return (
    <Formik
      initialValues={{
        lb_format: initialLbformat.id,
        lb_type: "points",
        firstPlaceRole: initRoles.find(({ for_first }) => for_first) || null,
        roles: initRoles.filter(({ for_first }) => !for_first),
      }}
      validate={validate}
      onSubmit={handleSubmit}
    >
      {(formikProps) => {
        const {
          handleSubmit,
          handleBlur,
          values,
          setFieldValue,
          touched,
          errors,
          isSubmitting,
          resetForm,
        } = formikProps;
        const disableInputs = isSubmitting;

        return (
          <FormikContext.Provider
            value={{ ...formikProps, disableInputs }}
            key={0}
          >
            <form onSubmit={handleSubmit} data-cy="form-edit-roles">
              <div className="panel panel-container">
                <div className="row gy-2">
                  <div className="col-6 d-flex align-items-center">
                    <p className="mb-0">Leaderboard Format</p>
                  </div>
                  <div className="col-6">
                    <Select
                      disabled={disableInputs}
                      name="lb_format"
                      value={values.lb_format}
                      onBlur={handleBlur}
                      onChange={(evt) => {
                        const lb_format = parseInt(evt.target.value);
                        const roles = selectCurrentRoles(
                          lb_format,
                          values.lb_type
                        );

                        resetForm({
                          values: {
                            ...values,
                            lb_format,
                            firstPlaceRole:
                              roles.find(({ for_first }) => for_first) || null,
                            roles: roles.filter(({ for_first }) => !for_first),
                          },
                        });
                      }}
                    >
                      {allowedFormats.map(({ name, id }) => (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="col-6 d-flex align-items-center">
                    <p className="mb-0">Leaderboard Type</p>
                  </div>
                  <div className="col-6">
                    <Select
                      disabled={disableInputs}
                      name="lb_type"
                      value={values.lb_type}
                      onChange={(evt) => {
                        const lb_type = evt.target.value;
                        const roles = selectCurrentRoles(
                          values.lb_format,
                          lb_type
                        );

                        resetForm({
                          values: {
                            ...values,
                            lb_type,
                            firstPlaceRole:
                              roles.find(({ for_first }) => for_first) || null,
                            roles: roles.filter(({ for_first }) => !for_first),
                          },
                        });
                      }}
                      onBlur={handleBlur}
                    >
                      {leaderboards.map(({ title, key }) => (
                        <option key={key} value={key}>
                          {title}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                <h2 className="text-center mt-4 mb-2">First Place Role</h2>
                <p className="text-center mb-4">
                  Role that gets assigned to the user in the first place of this
                  leaderboard.
                </p>
                <div
                  className="row d-flex justify-content-center"
                  data-cy="first-place-role"
                >
                  <div className="col-12 col-md-6">
                    {values.firstPlaceRole ? (
                      <RoleForm
                        disabled={disableInputs}
                        name="firstPlaceRole"
                        value={values.firstPlaceRole}
                        onChange={(newVal) =>
                          setFieldValue("firstPlaceRole", newVal)
                        }
                        onDelete={() => setFieldValue("firstPlaceRole", null)}
                        errors={errors}
                        touched={touched?.firstPlaceRole}
                        guilds={guilds}
                      />
                    ) : (
                      <div className="flex-hcenter">
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={() =>
                            setFieldValue("firstPlaceRole", { ...emptyRole })
                          }
                          data-cy="btn-add-first-place-role"
                        >
                          <i className="bi bi-plus-lg" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <h2 className="text-center mt-4 mb-2">Point Threshold Roles</h2>
                <p className="text-center mb-4">
                  Roles that get assigned when a user goes past a certain point
                  threshold for this specific leaderboard.
                </p>
                <AddableField
                  name="roles"
                  defaultValue={{ ...emptyRole }}
                  disabled={disableInputs}
                  addFieldsBtn={({ addValue }) => (
                    <>
                      <div className="flex-hcenter mt-3">
                        <button
                          type="button"
                          className="btn btn-success font-border me-3 fw-bold"
                          disabled={disableInputs}
                          onClick={addValue}
                          data-cy="btn-addable-field"
                        >
                          New Role
                        </button>

                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={disableInputs}
                        >
                          Save
                        </button>
                      </div>
                    </>
                  )}
                >
                  <div className="row gy-5 mb-5" data-cy="threshold-roles">
                    {values.roles.length === 0 ? (
                      <p className="muted text-center lead mb-0">
                        No roles for this leaderboard format/type yet!
                      </p>
                    ) : (
                      values.roles.map((role, i) => (
                        <div key={role.count} className="col-12 col-md-6">
                          <RoleForm
                            disabled={disableInputs}
                            name={`roles[${i}]`}
                            value={role}
                            threshold
                            errors={errors}
                            touched={touched?.roles?.[i]}
                            guilds={guilds}
                            onChange={(newVal) =>
                              setFieldValue(
                                "roles",
                                values.roles.map((role, j) =>
                                  i === j ? newVal : role
                                )
                              )
                            }
                            onDelete={() =>
                              setFieldValue(
                                "roles",
                                values.roles.filter((_r, j) => i !== j)
                              )
                            }
                          />
                        </div>
                      ))
                    )}
                  </div>
                </AddableField>
              </div>
            </form>

            <ErrorToast />
            <ToastSuccess show={success} onClose={() => setSuccess(false)}>
              Roles changed!
            </ToastSuccess>
          </FormikContext.Provider>
        );
      }}
    </Formik>
  );
}
