"use client";
import "./newmap.css";
import { getCustomMap } from "@/server/ninjakiwiRequests";
import { Formik } from "formik";
import { createContext, Fragment, useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useAppSelector } from "@/lib/store";
import {
  selectDiscordAccessToken,
  selectMaplistProfile,
} from "@/features/authSlice";
import { selectMaplistConfig } from "@/features/maplistSlice";
import { difficulties } from "@/utils/maplistUtils";
import { isFloat } from "@/utils/functions";
import { addMap } from "@/server/maplistRequests.client";

const MAX_NAME_LEN = 100;
const MAX_URL_LEN = 300;
const MAX_TEXT_LEN = 100;
const MAX_ALIAS_LENGTH = 20;

const randomAliases = ["ouch", "bluddles", "muddles", "ws", "wshop"];

const placementFields = ["placement_curver", "placement_allver"];
const distinctFields = {
  aliases: "alias",
  additional_codes: "code",
  creators: "id",
  version_compatibilities: "version",
};
const urlFields = ["r6_start", "map_data"];
const versionFields = [
  { field: "verifiers", inner: "version", req: false },
  { field: "version_compatibilities", inner: "version", req: false },
];
const textFields = [
  { field: "creators", inner: "role" },
  { field: "additional_codes", inner: "description" },
];

const getRepeatedIndexes = (list) => {
  const sortedList = list
    .map((val, i) => ({ val, i }))
    .toSorted((a, b) => (a.val > b.val ? 1 : -1));
  const repeated = [];
  for (let i = 1; i < sortedList.length; i++)
    if (sortedList[i].val === sortedList[i - 1].val)
      repeated.push(sortedList[i].i);
  return repeated;
};

const FormikContext = createContext({});

export default function MapForm_C({ initialValues, code }) {
  const [currentMap, setCurrentMap] = useState(
    code ? { code, valid: true } : null
  );
  const [showErrorCount, setShowErrorCount] = useState(false);
  const { maplistProfile } = useAppSelector(selectMaplistProfile);
  const maplistCfg = useAppSelector(selectMaplistConfig);
  const accessToken = useAppSelector(selectDiscordAccessToken);

  if (!maplistProfile) return null;

  const validate = async (values) => {
    const errors = {};
    if (
      values.code.length !== 7 &&
      !/^https:\/\/join\.btd6\.com\/Map\/[A-Z]{7}$/.test(values.code)
    ) {
      errors.code = "Codes must be 7 characters long";
    } else {
      const code = (
        values.code.length === 7
          ? values.code
          : values.code.match(
              /^https:\/\/join\.btd6\.com\/Map\/([A-Za-z]{7})$/
            )[1]
      ).toUpperCase();

      if (!currentMap || currentMap.code !== code)
        setCurrentMap({ code, valid: !!(await getCustomMap(code)) });
    }

    if (!values.name.length) errors.name = "Name cannot be blank";
    else if (values.name.length > MAX_NAME_LEN)
      errors.name = "Name is too long";

    for (let i = 0; i < values.aliases.length; i++)
      if (values.aliases[i].alias.length > MAX_ALIAS_LENGTH)
        errors[`aliases[${i}].alias`] = "Alias is too long";
      else if (!/^[a-zA-Z0-9_-]*$/.test(values.aliases[i].alias))
        errors[`aliases[${i}].alias`] =
          'Alias can only have alphanumeric characters or "_-"';

    for (const field of Object.keys(distinctFields)) {
      const repeatedIdx = getRepeatedIndexes(
        values[field].map((x) => x[distinctFields[field]])
      );
      for (const idx of repeatedIdx)
        if (values[field][idx][distinctFields[field]].toString().length)
          errors[`${field}[${idx}].${distinctFields[field]}`] =
            "Field is repeated";
    }

    for (const urlField of urlFields)
      if (values[urlField].length > MAX_URL_LEN)
        errors[urlField] = "URL is too long";

    for (const { field, inner } of textFields)
      for (let i = 0; i < values[field].length; i++)
        if (values[field][i][inner].length > MAX_TEXT_LEN)
          errors[
            `${field}[${i}].${inner}`
          ] = `Must be under ${MAX_TEXT_LEN} characters`;

    for (const { field, inner, req } of versionFields)
      for (let i = 0; i < values[field].length; i++)
        if (values[field][i][inner].length === 0) {
          if (req) errors[`${field}[${i}].${inner}`] = `This is required`;
        } else if (!isFloat(values[field][i][inner])) {
          errors[`${field}[${i}].${inner}`] = `This must be a game version`;
        }

    for (const plcmField of placementFields)
      if (
        values[plcmField].toString().length &&
        (values[plcmField] <= 0 || values[plcmField] > maplistCfg.map_count)
      )
        errors[plcmField] = `Must be between 1 and ${maplistCfg.map_count}`;

    if (
      values.placement_curver === "" &&
      values.placement_allver === "" &&
      values.difficulty === "-1"
    ) {
      errors.placement_curver = "At least one of these is required";
      errors.placement_allver = "At least one of these is required";
      errors.difficulty = "At least one of these is required";
    }

    if (values.creators[0].id.length === 0)
      errors["creators[0].id"] = "Must have at least 1 creator";

    return errors;
  };

  const handleSubmit = async (values, { setErrors }) => {
    const code =
      values.code.length === 7
        ? values.code.toUpperCase()
        : values.code.match(/^https:\/\/join\.btd6\.com\/Map\/([A-Z]{7})$/)[1];

    const removeFieldCode = (array) =>
      array.map((obj) => {
        const ret = { ...obj };
        delete ret.count;
        return ret;
      });

    const payload = {
      ...values,
      placement_curver:
        values.placement_curver === "" ? -1 : parseInt(values.placement_curver),
      placement_allver:
        values.placement_allver === "" ? -1 : parseInt(values.placement_allver),
      difficulty: parseInt(values.difficulty),
      map_data: values.map_data_req_permission
        ? "a"
        : values.map_data.length
        ? values.map_data
        : null,
      r6_start: values.r6_start.length ? values.r6_start : null,
      aliases: values.aliases
        .map(({ alias }) => alias)
        .filter((a) => a.length > 0),
      additional_codes: removeFieldCode(values.additional_codes)
        .filter(({ code }) => code.length > 0)
        .map(({ code, description }) => ({
          code,
          description: description.length ? description : null,
        })),
      version_compatibilities: removeFieldCode(values.version_compatibilities)
        .filter(({ version }) => version.length > 0)
        .map(({ version, status }) => ({
          version: parseFloat(version) * 10,
          status: parseInt(status),
        })),
      creators: removeFieldCode(values.creators)
        .filter(({ id }) => id.length > 0)
        .map(({ id, role }) => ({
          id,
          role: role.length ? role : null,
        })),
      verifiers: removeFieldCode(values.verifiers)
        .filter(({ id }) => id.length > 0)
        .map(({ id, version }) => ({
          id,
          version: version.length ? parseFloat(version) * 10 : null,
        })),
    };
    delete payload.map_data_req_permission;

    const result = await addMap(accessToken.access_token, payload);
    if (result && Object.keys(result.errors).length) {
      setErrors(result.errors);
      return;
    }

    // revalidate maps;
    // navigate to new map;
  };

  return (
    <Formik
      validate={validate}
      initialValues={
        initialValues || {
          code: "",
          name: "",
          placement_curver: "",
          placement_allver: "",
          difficulty: "-1",
          r6_start: "",
          map_data: "",
          map_data_req_permission: false,
          creators: [{ id: "", role: "" }],
          verifiers: [{ id: "", version: "" }],
          additional_codes: [],
          version_compatibilities: [],
          aliases: [],
          // optimal_heros: [],
        }
      }
      onSubmit={handleSubmit}
    >
      {(formikProps) => {
        const {
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          setValues,
          touched,
          errors,
          isSubmitting,
        } = formikProps;

        let errorCount = Object.keys(errors).length;
        if (
          !maplistProfile.roles.includes(
            process.env.NEXT_PUBLIC_LISTMOD_ROLE
          ) &&
          "placement_allver" in errors
        )
          errorCount--;
        if (
          !maplistProfile.roles.includes(
            process.env.NEXT_PUBLIC_LISTMOD_ROLE
          ) &&
          "placement_curver" in errors
        )
          errorCount--;
        if (
          !maplistProfile.roles.includes(process.env.NEXT_PUBLIC_EXPMOD_ROLE) &&
          "difficulty" in errors
        )
          errorCount--;

        return (
          <FormikContext.Provider value={formikProps}>
            <Form
              onSubmit={(evt) => {
                setShowErrorCount(true);
                handleSubmit(evt);
              }}
              key={0}
            >
              <Form.Group className="mapcode-input">
                <Form.Label>Map Code</Form.Label>
                <Form.Control
                  name="code"
                  type="text"
                  placeholder={"CHIMENE"}
                  value={values.code}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={
                    touched.code &&
                    (values.code.length === 0 || "code" in errors)
                  }
                  isValid={!("code" in errors)}
                  disabled={isSubmitting}
                  autoComplete="off"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.code}
                </Form.Control.Feedback>
              </Form.Group>

              <p className="muted text-center">
                You can also paste the whole map share URL
              </p>

              {currentMap && currentMap.valid && (
                <>
                  <hr className="mb-5" />

                  <div className="row flex-row-space mt-5">
                    <div className="col-12 col-lg-6">
                      <div className="panel pt-3 px-3 pb-4 map-preview">
                        <div className="map-name-container">
                          <Form.Group>
                            <Form.Control
                              name="name"
                              type="text"
                              placeholder={"chimene.mo's map"}
                              value={values.name}
                              onChange={handleChange}
                              isInvalid={
                                touched.name &&
                                (values.name.length === 0 || "name" in errors)
                              }
                              isValid={!("name" in errors)}
                              disabled={isSubmitting}
                              autoComplete="off"
                            />
                          </Form.Group>
                        </div>

                        <img
                          className="w-100"
                          src={`https://data.ninjakiwi.com/btd6/maps/map/${currentMap.code}/preview`}
                        />
                      </div>
                    </div>

                    <div className="col-12 col-lg-6">
                      <div className="panel h-100">
                        <div className="row flex-row-space my-3">
                          {maplistProfile.roles.includes(
                            process.env.NEXT_PUBLIC_LISTMOD_ROLE
                          ) && (
                            <>
                              <SidebarField
                                title="List Placement"
                                name="placement_curver"
                                type="number"
                                placeholder="N/A"
                                invalidFeedback
                              />

                              <SidebarField
                                title="List Placement (All Versions)"
                                name="placement_allver"
                                type="number"
                                placeholder="N/A"
                                invalidFeedback
                              />
                            </>
                          )}

                          {maplistProfile.roles.includes(
                            process.env.NEXT_PUBLIC_EXPMOD_ROLE
                          ) && (
                            <SidebarField title="Expert Difficulty">
                              <Form.Select
                                name="difficulty"
                                value={values.difficulty}
                                onChange={handleChange}
                                disabled={isSubmitting}
                              >
                                <option value="-1">N/A</option>
                                {difficulties.map(({ name, value }) => (
                                  <option key={value} value={value}>
                                    {name} Expert
                                  </option>
                                ))}
                              </Form.Select>
                            </SidebarField>
                          )}

                          <SidebarField
                            title="Map Data"
                            name="map_data"
                            placeholder="https://drive.google.com/..."
                            invalidFeedback
                            appendChildren
                            value={({ values }) =>
                              values.map_data_req_permission
                                ? ""
                                : values.map_data
                            }
                            isValid={({ values }) =>
                              !("map_data" in errors) &&
                              values.map_data &&
                              !values.map_data_req_permission
                            }
                            disabled={({ isSubmitting, values }) =>
                              isSubmitting || values.map_data_req_permission
                            }
                          >
                            <Form.Group className="mb-3">
                              <Form.Check
                                name="map_data_req_permission"
                                checked={values.map_data_req_permission}
                                onChange={handleChange}
                                label="Should ask permission to the creator"
                                disabled={isSubmitting}
                              />
                            </Form.Group>
                          </SidebarField>

                          <SidebarField
                            title="Round 6 start image/video"
                            name="r6_start"
                            placeholder="https://imgur.com/..."
                            invalidFeedback
                          />
                          <p className="muted text-center">
                            Please don't upload Discord URLs. Upload the image
                            to{" "}
                            <a href="https://imgur.com/" target="_blank">
                              Imgur
                            </a>{" "}
                            first or another site like that.
                          </p>
                        </div>
                      </div>
                    </div>

                    <h2 className="mt-3">Aliases</h2>
                    <AddableField name="aliases" defaultValue={{ alias: "" }}>
                      {values.aliases.length > 0 && (
                        <p className="muted text-center">
                          Leave an alias field blank to delete it.
                        </p>
                      )}

                      {values.aliases.map(({ alias, count }, i) => (
                        <div
                          key={count || -1}
                          className="col-4 col-md-3 col-xl-2"
                        >
                          <Form.Group>
                            <Form.Control
                              name={`aliases[${i}].alias`}
                              type="text"
                              placeholder={
                                randomAliases[i % randomAliases.length]
                              }
                              value={alias}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={
                                touched.aliases &&
                                `aliases[${i}].alias` in errors
                              }
                              disabled={isSubmitting}
                              autoComplete="off"
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors[`aliases[${i}].alias`]}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </div>
                      ))}
                    </AddableField>

                    <h2 className="mt-3">Creators</h2>
                    <AddableField
                      name="creators"
                      defaultValue={{ id: "", role: "" }}
                    >
                      <TwoFieldEntry
                        name="creators"
                        labels={["Creator", "Role?"]}
                        fields={["creators[i].id", "creators[i].role"]}
                        secondProps={{
                          placeholder: "Gameplay",
                        }}
                      />
                    </AddableField>

                    <h2 className="mt-3">Verifications</h2>
                    <AddableField
                      name="verifiers"
                      defaultValue={{ id: "", version: "" }}
                    >
                      <TwoFieldEntry
                        name="verifiers"
                        labels={["Verifier", "Version?"]}
                        fields={["verifiers[i].id", "verifiers[i].version"]}
                        secondProps={{
                          placeholder: "Leave blank if first verification",
                        }}
                        omitFirstOptional
                      />
                    </AddableField>

                    <h2 className="mt-3">Additional Codes</h2>
                    <AddableField
                      name="additional_codes"
                      defaultValue={{ code: "", description: "" }}
                    >
                      <TwoFieldEntry
                        name="additional_codes"
                        labels={["Code", "Description?"]}
                        fields={[
                          "additional_codes[i].code",
                          "additional_codes[i].description",
                        ]}
                        secondProps={{
                          placeholder: "Small niche gameplay difference",
                        }}
                        optional
                      />
                    </AddableField>

                    <h2 className="mt-3">Version Compatibility</h2>
                    <p className="muted text-center">
                      By default, it assumes the map is unplayable since v39.0
                      onwards.
                    </p>
                    <AddableField
                      name="version_compatibilities"
                      defaultValue={{ version: "", status: "0" }}
                    >
                      <div className="flex-hcenter">
                        <div>
                          {values.version_compatibilities.map(
                            ({ version, status, count }, i) => (
                              <div key={count || -1} className="vcompat">
                                <p>Since v&nbsp;</p>
                                <Form.Group className="vcompat-input">
                                  <Form.Control
                                    name={`version_compatibilities[${i}].version`}
                                    type="text"
                                    value={version}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={
                                      touched.version_compatibilities &&
                                      `version_compatibilities[${i}].version` in
                                        errors
                                    }
                                    isValid={
                                      values[
                                        `version_compatibilities[${i}].version`
                                      ]
                                    }
                                    disabled={isSubmitting}
                                    autoComplete="off"
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {
                                      errors[
                                        `version_compatibilities[${i}].version`
                                      ]
                                    }
                                  </Form.Control.Feedback>
                                </Form.Group>
                                <p>&nbsp;the map&nbsp;</p>
                                <div className="vcompat-select">
                                  <Form.Select
                                    name={`version_compatibilities[${i}].status`}
                                    value={status}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                  >
                                    <option value="0">is playable</option>
                                    <option value="1">crashes</option>
                                    <option value="2">
                                      has only visal diffs
                                    </option>
                                    <option value="3">
                                      runs, but isn't recommended
                                    </option>
                                  </Form.Select>
                                </div>
                                {i > 0 && (
                                  <div>
                                    <div className="d-flex flex-column w-100">
                                      <Button
                                        variant="danger"
                                        onClick={(_e) =>
                                          setValues({
                                            ...values,
                                            version_compatibilities:
                                              values.version_compatibilities.filter(
                                                (_v, idx) => idx !== i
                                              ),
                                          })
                                        }
                                      >
                                        <i className="bi bi-dash" />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </AddableField>
                  </div>

                  <div className="flex-hcenter mt-5">
                    <Button type="submit" disabled={isSubmitting}>
                      Submit
                    </Button>
                  </div>
                  {showErrorCount && (
                    <p className="text-center text-danger mt-3">
                      There are {errorCount} fields to compile correctly
                    </p>
                  )}
                </>
              )}
            </Form>
          </FormikContext.Provider>
        );
      }}
    </Formik>
  );
}

function SidebarField({
  title,
  name,
  type,
  placeholder,
  invalidFeedback,
  children,
  appendChildren,
  value,
  isValid,
  disabled,
}) {
  const formikProps = useContext(FormikContext);
  const { handleChange, handleBlur, values, touched, errors, isSubmitting } =
    formikProps;

  return (
    <>
      <div className="col-6 col-lg-7">
        <p>{title}</p>
      </div>
      <div className="col-6 col-lg-5">
        {children && !appendChildren ? (
          children
        ) : (
          <Form.Group>
            <Form.Control
              name={name}
              type={type || "text"}
              placeholder={placeholder || ""}
              value={value ? value(formikProps) : values[name]}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched[name] && name in errors}
              isValid={
                isValid
                  ? isValid(formikProps)
                  : !(name in errors) && values[name]
              }
              disabled={disabled ? disabled(formikProps) : isSubmitting}
              autoComplete="off"
            />
            {invalidFeedback && (
              <Form.Control.Feedback type="invalid">
                {errors[name]}
              </Form.Control.Feedback>
            )}
            {appendChildren && children}
          </Form.Group>
        )}
      </div>
    </>
  );
}

function TwoFieldEntry({
  name,
  fields,
  labels,
  firstProps,
  secondProps,
  omitFirstOptional,
  optional,
}) {
  const formikProps = useContext(FormikContext);
  const {
    handleChange,
    handleBlur,
    values,
    setValues,
    touched,
    errors,
    isSubmitting,
  } = formikProps;

  return values[name].map(({ count }, i) => {
    const realField1 = fields[0].replace("[i]", `[${i}]`);
    const realField2 = fields[1].replace("[i]", `[${i}]`);
    const topLevelField1 = fields[0].split("[")[0].split("(")[0];
    const topLevelField2 = fields[1].split("[")[0].split("(")[0];

    // Not flexible, should split by "." walk through the list
    const value1 = values[name][i][fields[0].split(".")[1]];
    const value2 = values[name][i][fields[1].split(".")[1]];

    return (
      <Fragment key={count || -1}>
        <div className="col-12 col-md-5 col-lg-6">
          <Form.Group>
            {labels && labels.length > 0 && (
              <Form.Label>{labels[0]}</Form.Label>
            )}
            <Form.Control
              name={realField1}
              type="text"
              value={value1}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched[topLevelField1] && realField1 in errors}
              isValid={values[realField1]}
              disabled={isSubmitting}
              autoComplete="off"
              {...firstProps}
            />
            <Form.Control.Feedback type="invalid">
              {errors[realField1]}
            </Form.Control.Feedback>
          </Form.Group>
        </div>
        <div className="col-9 col-md-5 col-lg-5">
          {!(omitFirstOptional && i === 0) && (
            <Form.Group>
              {labels && labels.length > 1 && (
                <Form.Label>{labels[1]}</Form.Label>
              )}
              <Form.Control
                name={realField2}
                type="text"
                value={value2}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched[topLevelField2] && realField2 in errors}
                isValid={value2}
                disabled={isSubmitting}
                autoComplete="off"
                {...secondProps}
              />
              <Form.Control.Feedback type="invalid">
                {errors[realField2]}
              </Form.Control.Feedback>
            </Form.Group>
          )}
        </div>

        <div className="col-3 col-md-2 col-lg-1 flex-hcenter">
          {(optional || i > 0) && (
            <div className="d-flex flex-column w-100">
              <Button
                className="map-form-rm-field"
                variant="danger"
                onClick={(_e) =>
                  setValues({
                    ...values,
                    [name]: values[name].filter((_v, idx) => idx !== i),
                  })
                }
              >
                <i className="bi bi-dash" />
              </Button>
            </div>
          )}
        </div>
      </Fragment>
    );
  });
}

function AddableField({ name, defaultValue, children }) {
  const [count, setCount] = useState(1);
  const formikProps = useContext(FormikContext);
  const { setValues, values } = formikProps;

  return (
    <>
      {children}

      <div className="flex-hcenter mt-3">
        <Button
          variant="success"
          onClick={(_e) => {
            setValues({
              ...values,
              [name]: [...values[name], { ...defaultValue, count }],
            });
            setCount(count + 1);
          }}
        >
          <i className="bi bi-plus-lg" />
        </Button>
      </div>
    </>
  );
}
