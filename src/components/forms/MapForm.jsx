"use client";
/* One thousand billion line code component please refactor immediately */
import stylesFrmMap from "./MapForm.module.css";
import { Formik } from "formik";
import { useState } from "react";
import { difficulties, mapDataToFormik } from "@/utils/maplistUtils";
import { isFloat } from "@/utils/functions";
import {
  revalidateMap,
  revalidateMapSubmissions,
} from "@/server/revalidations";
import { useRouter } from "next/navigation";
import {
  useAuthLevels,
  useDiscordToken,
  useMaplistConfig,
} from "@/utils/hooks";
import { addMap, deleteMap, editMap } from "@/server/maplistRequests.client";
import { FormikContext } from "@/contexts";
import AddableField from "./AddableField";
import TwoFieldEntry from "./TwoFieldEntry";
import SidebarField from "./MapSidebarField";
import MapCodeController, { codeRegex } from "./MapCodeController";
import DragFiles from "./DragFiles";
import ErrorToast from "./ErrorToast";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import Input from "./bootstrap/Input";
import { imageFormats, maxImgSizeMb } from "@/utils/file-formats";
import { getRepeatedIndexes } from "@/utils/validators";

const MAX_NAME_LEN = 100;
const MAX_URL_LEN = 300;
const MAX_TEXT_LEN = 100;
const MAX_ALIAS_LENGTH = 255;

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

const heros = [
  "quincy",
  "gwen",
  "obyn",
  "striker",
  "churchill",
  "ben",
  "ezili",
  "pat",
  "adora",
  "brickell",
  "etienne",
  "sauda",
  "psi",
  "geraldo",
  "corvus",
  "rosalia",
];

const defaultValues = {
  code: "",
  name: "",
  placement_curver: "",
  placement_allver: "",
  difficulty: "-1",
  r6_start: "",
  r6_start_file: [],
  map_data: "",
  map_data_req_permission: false,
  creators: [{ id: "", role: "" }],
  verifiers: [{ id: "", version: "" }],
  additional_codes: [],
  version_compatibilities: [],
  aliases: [],
  optimal_heros: ["geraldo"],
  map_preview_url: "",
  map_preview_file: [],
};

export default function MapForm({
  initialValues,
  code,
  onAdd,
  onEdit,
  onDelete,
  buttons,
  submitText,
  isDeleted,
}) {
  const [currentMap, setCurrentMap] = useState(
    code ? { code, valid: true, editing: true, isDeleted } : null
  );
  const [isFetching, setIsFetching] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showErrorCount, setShowErrorCount] = useState(false);
  const [showDeleting, setShowDeleting] = useState(false);
  const authLevels = useAuthLevels();
  const maplistCfg = useMaplistConfig();
  const accessToken = useDiscordToken();
  const router = useRouter();

  submitText = submitText || "Submit";
  buttons = buttons || [];
  onAdd = onAdd || addMap;
  onEdit = onEdit || editMap;
  onDelete =
    onDelete ||
    (async (access_token, code) => {
      await deleteMap(access_token, code);
      await new Promise((resolve) => {
        revalidateMap(code)
          .then(() => router.push("/maplist"))
          .then(resolve);
      });
    });
  initialValues = initialValues || defaultValues;

  const isEditing = !!code || (currentMap && currentMap.editing);

  if (!authLevels.loaded) return null;

  const validate = async (values) => {
    const errors = {};
    if (!codeRegex.test(values.code))
      errors.code = "Codes must be exactly 7 letters";

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

    if (authLevels.isListMod || authLevels.isAdmin) {
      for (const plcmField of placementFields) {
        const val = parseInt(values[plcmField]);
        if (
          values[plcmField].toString().length &&
          (val <= 0 ||
            (val > maplistCfg.map_count &&
              val !== parseInt(initialValues[plcmField])))
        )
          errors[plcmField] = `Must be between 1 and ${maplistCfg.map_count}`;
      }
    }

    if (
      values.placement_curver === "" &&
      values.placement_allver === "" &&
      values.difficulty === "-1"
    ) {
      errors.placement_curver = "At least one of these is required";
      errors.placement_allver = "At least one of these is required";
      errors.difficulty = "At least one of these is required";
    }

    if (!values.creators.some(({ id }) => id.length))
      errors["creators[0].id"] = "Must have at least 1 creator";

    const fileFields = ["r6_start_file", "map_preview_file"];
    for (const ff of fileFields) {
      const fsize = values[ff]?.[0]?.file?.size || 0;
      if (fsize > 1024 ** 2 * maxImgSizeMb)
        errors[ff] = `Can upload maximum ${maxImgSizeMb}MB (yours is ${(
          fsize /
          1024 ** 2
        ).toFixed(2)}MB)`;
    }

    return errors;
  };

  const handleSubmit = async (values, { setErrors }) => {
    const code = values.code.match(codeRegex)[1].toUpperCase();

    const additionalCodes = values.additional_codes.filter(
      ({ code }) => code.length > 0
    );
    const versionCompat = values.version_compatibilities.filter(
      ({ version }) => version.length > 0
    );
    const creators = values.creators.filter(({ id }) => id.length > 0);
    const verifiers = values.verifiers.filter(({ id }) => id.length > 0);
    const aliases = values.aliases.filter((a) => a.alias.length > 0);

    const payload = {
      ...values,
      placement_curver:
        values.placement_curver === "" ? -1 : parseInt(values.placement_curver),
      placement_allver:
        values.placement_allver === "" ? -1 : parseInt(values.placement_allver),
      difficulty: parseInt(values.difficulty),
      map_data: null,
      r6_start: values.r6_start_file.length
        ? values.r6_start_file[0].file
        : values.r6_start || null,
      map_preview_url: values.map_preview_file.length
        ? values.map_preview_file[0].file
        : values.map_preview_url || null,

      aliases: aliases.map(({ alias }) => alias),
      additional_codes: additionalCodes.map(({ code, description }) => ({
        code,
        description: description.length ? description : null,
      })),
      version_compatibilities: versionCompat.map(({ version, status }) => ({
        version: parseFloat(version),
        status: parseInt(status),
      })),
      creators: creators.map(({ id, role }) => ({
        id,
        role: role.length ? role : null,
      })),
      verifiers: verifiers.map(({ id, version }) => ({
        id,
        version: version.length ? parseFloat(version) * 10 : null,
      })),
    };
    delete payload.map_data_req_permission;
    delete payload.r6_start_file;
    delete payload.map_preview_file;

    const onSubmit = isEditing ? onEdit : onAdd;
    const result = await onSubmit(accessToken.access_token, payload);
    if (result && Object.keys(result.errors).length) {
      const mtmFields = {
        creators,
        version_compatibilities: versionCompat,
        additional_codes: additionalCodes,
        aliases,
        verifiers,
      };
      const mtmFieldKeys = Object.keys(mtmFields);
      const aggrErrorKeys = Object.keys(result.errors)
        .filter((key) => mtmFieldKeys.includes(key.split("[")[0]))
        .sort()
        .reverse();
      for (const field of aggrErrorKeys) {
        const idx = parseInt(field.match(/\[(\d+)]/)[1]);
        const mtmName = field.split("[")[0];
        const sentValue = mtmFields[mtmName][idx];
        const actualIdx = values[mtmName].findIndex(
          ({ count }) => count === sentValue.count
        );
        const actualKey = field.replace(/\[\d+]/, `[${actualIdx}]`);
        if (actualKey === field) continue;
        result.errors[actualKey] = result.errors[field];
        delete result.errors[field];
      }

      setErrors(result.errors);
      return;
    }

    setIsRedirecting(true);
    if (!isEditing) revalidateMapSubmissions();
    revalidateMap(code).then(() => router.push(`/map/${code}`));
  };

  return (
    <Formik
      validate={validate}
      initialValues={initialValues}
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

        let errorCount = Object.keys(errors).length;
        if ("" in errors) errorCount--;
        if (!(authLevels.isListMod || authLevels.isAdmin)) {
          if ("placement_allver" in errors) errorCount--;
          if ("placement_curver" in errors) errorCount--;
        }
        if (
          !(authLevels.isExplistMod || authLevels.isAdmin) &&
          "difficulty" in errors
        )
          errorCount--;
        const disableInputs = isRedirecting || isFetching;

        return (
          <FormikContext.Provider
            value={{ ...formikProps, disableInputs }}
            key={0}
          >
            <form
              onSubmit={(evt) => {
                setShowErrorCount(true);
                handleSubmit(evt);
              }}
              className={stylesFrmMap.addmap}
              data-cy="form-edit-map"
            >
              {!code && (
                <MapCodeController
                  name="code"
                  isFetching={isFetching}
                  setIsFetching={setIsFetching}
                  currentMap={currentMap?.code}
                  onMapSuccess={({ mapData, isMaplist }) => {
                    const code = isMaplist ? mapData.code : mapData.id;
                    isMaplist
                      ? setValues(mapDataToFormik(mapData))
                      : setValues({
                          ...defaultValues,
                          code,
                          name: mapData.name,
                        });
                    setCurrentMap({
                      code,
                      valid: true,
                      editing: isMaplist,
                      isDeleted: isMaplist && mapData.deleted_on !== null,
                    });
                  }}
                  onMapFail={() =>
                    setErrors({
                      ...errors,
                      code: "No map with that code found",
                    })
                  }
                />
              )}

              {currentMap && currentMap.valid && (
                <>
                  {!code && <hr className="mb-5" />}

                  <div className="row flex-row-space mt-5">
                    {/* Map preview */}
                    <div className="col-12 col-lg-6">
                      <div
                        className={`panel pt-3 px-3 pb-4 ${stylesFrmMap.map_preview}`}
                      >
                        <div className={`${stylesFrmMap.map_name_container}`}>
                          <div>
                            <Input
                              name="name"
                              type="text"
                              placeholder={"Super Hard Map's name"}
                              value={values.name}
                              onChange={handleChange}
                              isInvalid={
                                touched.name &&
                                (values.name.length === 0 || "name" in errors)
                              }
                              isValid={!("name" in errors)}
                              disabled={isSubmitting || disableInputs}
                              autoComplete="off"
                            />
                          </div>
                        </div>

                        <div data-cy="form-group">
                          <DragFiles
                            name="map_preview_file"
                            formats={imageFormats}
                            limit={1}
                            onChange={handleChange}
                            value={values.map_preview_file}
                            className="w-100 mt-4"
                            showChildren
                          >
                            <div className="d-flex justify-content-center">
                              {values.map_preview_file.length > 0 ? (
                                <img
                                  style={{ maxWidth: "100%" }}
                                  src={values.map_preview_file[0].objectUrl}
                                />
                              ) : (
                                <img
                                  style={{ maxWidth: "100%" }}
                                  src={
                                    values.map_preview_url ||
                                    `https://data.ninjakiwi.com/btd6/maps/map/${values.code}/preview`
                                  }
                                />
                              )}
                            </div>
                          </DragFiles>
                          {"map_preview_file" in errors && (
                            <p className="text-danger text-center my-1">
                              {errors.map_preview_file}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Sidebar */}
                    <div className="col-12 col-lg-6">
                      <div className="panel h-100">
                        <div className="row flex-row-space my-3">
                          {(authLevels.isListMod || authLevels.isAdmin) && (
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

                          {(authLevels.isExplistMod || authLevels.isAdmin) && (
                            <SidebarField title="Expert Difficulty">
                              <select
                                className="form-select"
                                name="difficulty"
                                value={values.difficulty}
                                onChange={handleChange}
                                disabled={isSubmitting || disableInputs}
                              >
                                <option value="-1">N/A</option>
                                {difficulties.map(({ name, value }) => (
                                  <option key={value} value={value}>
                                    {name} Expert
                                  </option>
                                ))}
                              </select>
                            </SidebarField>
                          )}

                          <h3 className="text-center">Round 6 Start</h3>
                          <SidebarField
                            type="url"
                            title="R6 Start URL"
                            name="r6_start"
                            placeholder="https://youtube.com/watch?v=..."
                            invalidFeedback
                          />

                          <div className="px-3" data-cy="form-group">
                            <DragFiles
                              name="r6_start_file"
                              formats={imageFormats}
                              limit={1}
                              onChange={handleChange}
                              value={values.r6_start_file}
                              className="w-100"
                              showChildren={
                                !!initialValues?.r6_start &&
                                imageFormats.some((ext) =>
                                  initialValues.r6_start.endsWith(ext)
                                )
                              }
                            >
                              <div className="d-flex justify-content-center">
                                {values.r6_start_file.length > 0 ? (
                                  <img
                                    style={{ maxWidth: "100%" }}
                                    src={values.r6_start_file[0].objectUrl}
                                  />
                                ) : (
                                  <img
                                    style={{ maxWidth: "100%" }}
                                    src={initialValues.r6_start}
                                  />
                                )}
                              </div>
                            </DragFiles>
                            {errors?.r6_start_file && (
                              <div className="invalid-feedback d-block text-center light">
                                {errors?.r6_start_file}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h2 className="mt-4">Optimal Heros</h2>
                  <div className={stylesFrmMap.herobtn_container}>
                    {heros.map((h) => (
                      <button
                        type="button"
                        key={h}
                        className={`btn btn-primary ${stylesFrmMap.herobtn} ${
                          values.optimal_heros.includes(h)
                            ? `${stylesFrmMap.active} active`
                            : ""
                        }`}
                        onClick={(_e) => {
                          if (values.optimal_heros.includes(h))
                            setFieldValue(
                              "optimal_heros",
                              values.optimal_heros.filter((h1) => h1 !== h)
                            );
                          else
                            setFieldValue("optimal_heros", [
                              ...values.optimal_heros,
                              h,
                            ]);
                        }}
                        data-cy="btn-hero"
                        data-cy-active={values.optimal_heros
                          .includes(h)
                          .toString()}
                      >
                        <img src={`/heros/hero_${h}.webp`} alt={h} />
                      </button>
                    ))}
                  </div>
                  {errors.optimal_heros && (
                    <p className="text-center mb-0 text-danger">
                      {errors.optimal_heros}
                    </p>
                  )}

                  <h2 className="mt-4">Aliases</h2>
                  <AddableField name="aliases" defaultValue={{ alias: "" }}>
                    {values.aliases.length > 0 && (
                      <p className="muted text-center">
                        Leave an alias field blank to delete it.
                      </p>
                    )}

                    <div className="row gy-2">
                      {values.aliases.map(({ alias, count }, i) => (
                        <div
                          key={count || -1}
                          className="col-4 col-md-3 col-xl-2"
                          data-cy="form-group"
                        >
                          <div>
                            <Input
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
                              disabled={isSubmitting || disableInputs}
                              autoComplete="off"
                            />
                            <div className="invalid-feedback">
                              {errors[`aliases[${i}].alias`]}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AddableField>

                  <h2 className="mt-4">Creators</h2>
                  <AddableField
                    name="creators"
                    defaultValue={{ id: "", role: "" }}
                  >
                    <div className="row gy-2">
                      <TwoFieldEntry
                        name="creators"
                        labels={["Creator", "Role?"]}
                        fields={["creators[i].id", "creators[i].role"]}
                        secondProps={{
                          placeholder: "Gameplay",
                        }}
                        firstIsUser
                      />
                    </div>
                  </AddableField>

                  <h2 className="mt-4">Verifications</h2>
                  <p className="muted text-center">
                    Verifications that aren't in the current update don't get
                    shown in the map's info page.
                  </p>
                  <div data-cy="fgroup-verifiers">
                    <AddableField
                      name="verifiers"
                      defaultValue={{ id: "", version: "" }}
                    >
                      <div className="row gy-2">
                        <TwoFieldEntry
                          name="verifiers"
                          labels={["Verifier", "Version?"]}
                          fields={["verifiers[i].id", "verifiers[i].version"]}
                          secondProps={{
                            placeholder: "Leave blank if first verification",
                          }}
                          omitFirstOptional
                          firstIsUser
                        />
                      </div>
                    </AddableField>
                  </div>

                  <h2 className="mt-4">Additional Codes</h2>
                  <div data-cy="fgroup-additional-codes">
                    <AddableField
                      name="additional_codes"
                      defaultValue={{ code: "", description: "" }}
                    >
                      <div className="row gy-2">
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
                      </div>
                    </AddableField>
                  </div>

                  <h2 className="mt-4">Version Compatibility</h2>
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
                            <div
                              key={count || -1}
                              className={stylesFrmMap.vcompat}
                            >
                              <p>Since v&nbsp;</p>

                              <div
                                className={stylesFrmMap.vcompat_input}
                                data-cy="form-group"
                              >
                                <Input
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
                                  disabled={isSubmitting || disableInputs}
                                  autoComplete="off"
                                />
                                <div className="invalid-feedback">
                                  {
                                    errors[
                                      `version_compatibilities[${i}].version`
                                    ]
                                  }
                                </div>
                              </div>

                              <p>&nbsp;the map&nbsp;</p>

                              <div
                                className={stylesFrmMap.vcompat_select}
                                data-cy="form-group"
                              >
                                <select
                                  className="form-select"
                                  name={`version_compatibilities[${i}].status`}
                                  value={status}
                                  onChange={handleChange}
                                  disabled={isSubmitting || disableInputs}
                                >
                                  <option value="0">is playable</option>
                                  <option value="3">crashes</option>
                                  <option value="1">
                                    has only visual differences
                                  </option>
                                  <option value="2">
                                    runs, but isn't recommended
                                  </option>
                                </select>
                              </div>

                              <div>
                                <div className="d-flex flex-column w-100">
                                  <button
                                    type="button"
                                    className="btn btn-danger"
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
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </AddableField>

                  <div className="flex-hcenter flex-col-space mt-5">
                    {isEditing && !currentMap?.isDeleted && (
                      <button
                        type="button"
                        disabled={isSubmitting || disableInputs}
                        onClick={() => setShowDeleting(true)}
                        className="btn btn-danger big"
                        data-cy="btn-delete"
                      >
                        Delete
                      </button>
                    )}
                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={isSubmitting || disableInputs}
                    >
                      {isEditing ? "Save" : "Insert"}
                    </button>
                  </div>

                  {showErrorCount && errorCount > 0 && (
                    <p className="text-center text-danger mt-3">
                      There are {errorCount} fields to compile correctly
                    </p>
                  )}
                </>
              )}
            </form>

            <ConfirmDeleteModal
              disabled={isSubmitting || disableInputs}
              show={showDeleting}
              onHide={() => setShowDeleting(false)}
              entity="map"
              onDelete={async (_e) => {
                setSubmitting(true);
                await onDelete(accessToken.access_token, code);
                setSubmitting(false);
              }}
            />
            <ErrorToast />
          </FormikContext.Provider>
        );
      }}
    </Formik>
  );
}
