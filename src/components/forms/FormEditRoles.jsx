"use client";
import { Formik } from "formik";
import RoleForm from "./form-components/RoleForm";
import Select from "./bootstrap/Select";
import { useAuthLevels } from "@/utils/hooks";
import { allFormats, leaderboards } from "@/utils/maplistUtils";
import AddableField from "./AddableField";
import { FormikContext } from "@/contexts";
import { useEffect, useState } from "react";
import { validateAchievableRole } from "@/utils/validators";

const emptyRole = {
  threshold: 1,
  clr_border: "#000000",
  clr_inner: "#ffffff",
  tooltip_description: "",
  name: "",
  discord_roles: [],
};

export default function FormEditRoles({ roles, guilds }) {
  const [extraGuilds, setExtraGuilds] = useState({});
  const [guildRoles, setGuildRoles] = useState({});
  const authLevels = useAuthLevels();
  const allowedFormats = allFormats.filter(
    ({ value }) =>
      (0 < value < 50 && authLevels.isListMod) ||
      (50 < value < 100 && authLevels.isExplistMod)
  );

  const validate = (values) => {
    const errors = {};

    if (values.firstPlaceRole) {
      const roleErrors = validateAchievableRole(values.firstPlaceRole);
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

    return errors;
  };

  const handleSubmit = (values) => {};

  const intToHex = (color) => `#${color.toString(16).padStart(6, "0")}`;

  const selectCurrentRoles = (lbFormat, lbValue) =>
    roles
      .filter(
        ({ lb_format, lb_type }) =>
          lb_format === lbFormat && lb_type === lbValue
      )
      .map((rl, idx) => ({
        ...rl,
        count: -idx,
        clr_border: intToHex(rl.clr_border),
        clr_inner: intToHex(rl.clr_inner),
      }));

  const initialLbformat = (allowedFormats?.[0] || allFormats[0]).value;
  const initRoles = selectCurrentRoles(initialLbformat, "points");
  return (
    <Formik
      initialValues={{
        lb_format: initialLbformat,
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
          handleChange,
          handleBlur,
          values,
          setFieldValue,
          setValues,
          touched,
          errors,
          setErrors,
          isSubmitting,
          setSubmitting,
        } = formikProps;
        const disableInputs = isSubmitting;

        // const neededGuildIds = values.roles.reduce(
        //   (accum, { discord_roles }) => [
        //     ...accum,
        //     ...discord_roles.map(({ guild_id }) => guild_id),
        //   ],
        //   []
        // );
        // useEffect(() => {}, [neededGuildIds]);

        return (
          <FormikContext.Provider
            value={{ ...formikProps, disableInputs }}
            key={0}
          >
            <form onSubmit={handleSubmit}>
              <div className="panel panel-container">
                <div className="row gy-2">
                  <div className="col-6 d-flex align-items-center">
                    <p className="mb-0">Leaderboard Format</p>
                  </div>
                  <div className="col-6">
                    <Select
                      name="lb_format"
                      value={values.lb_format}
                      onBlur={handleBlur}
                      onChange={(evt) => {
                        const lb_format = parseInt(evt.target.value);
                        const roles = selectCurrentRoles(
                          lb_format,
                          values.lb_type
                        );

                        setValues({
                          ...values,
                          lb_format,
                          roles,
                        });
                      }}
                    >
                      {allowedFormats.map(({ name, value }) => (
                        <option key={value} value={value}>
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
                      name="lb_type"
                      value={values.lb_type}
                      onChange={(evt) => {
                        setFieldValue("lb_type", evt.target.value);
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

                <h2 className="text-center my-4">First Place Role</h2>
                <div className="row d-flex justify-content-center">
                  <div className="col-12 col-md-6 col-lg-4">
                    {values.firstPlaceRole ? (
                      <RoleForm
                        name="firstPlaceRole"
                        value={values.firstPlaceRole}
                        onChange={(newVal) =>
                          setFieldValue("firstPlaceRole", newVal)
                        }
                        onDelete={() => setFieldValue("firstPlaceRole", null)}
                        errors={errors}
                        touched={touched?.firstPlaceRole}
                      />
                    ) : (
                      <button
                        type="button"
                        className="btn btn-success w-100"
                        onClick={() =>
                          setFieldValue("firstPlaceRole", { ...emptyRole })
                        }
                      >
                        <i className="bi bi-plus-lg" />
                      </button>
                    )}
                  </div>
                </div>

                <h2 className="text-center my-4">Threshold Roles</h2>
                <AddableField name="roles" defaultValue={{ ...emptyRole }}>
                  <div className="row gy-4 mb-5">
                    {values.roles.map((role, i) => (
                      <div
                        key={role.count}
                        className="col-12 col-md-6 col-lg-4"
                      >
                        <RoleForm
                          name={`roles[${i}]`}
                          value={role}
                          threshold
                          errors={errors}
                          touched={touched?.roles?.[i]}
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
                    ))}
                  </div>
                </AddableField>
              </div>

              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </FormikContext.Provider>
        );
      }}
    </Formik>
  );
}
