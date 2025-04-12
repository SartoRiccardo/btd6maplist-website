"use client";
import { Formik } from "formik";
import { useCallback, useContext, useState } from "react";
import {
  useDiscordToken,
  useFormatsWhere,
  useMaplistFormats,
} from "@/utils/hooks";
import { FormikContext } from "@/contexts";
import MapCodeController, { codeRegex } from "./MapCodeController";
import Btd6Map from "../maps/Btd6Map";
import DragFiles from "./DragFiles";
import Link from "next/link";
import { submitMap } from "@/server/maplistRequests.client";
import { MapSubmissionRules } from "../layout/maplists/MaplistRules";
import ErrorToast from "./ErrorToast";
import Input from "./bootstrap/Input";
import { imageFormats, maxImgSizeMb } from "@/utils/file-formats";
import { revalidateMapSubmissions } from "@/server/revalidations";
import Select from "./bootstrap/Select";
import LazyFade from "../transitions/LazyFade";
import MessageBanned from "../ui/MessageBanned";
import NostalgiaPackSelect from "./form-components/NostalgiaPackSelect";
import { allFormats } from "@/utils/maplistUtils";

const MAX_TEXT_LEN = 500;

const validate = async (values) => {
  const errors = {};
  if (!codeRegex.test(values.code))
    errors.code = "Codes must be exactly 7 letters";

  if (values.notes.length > MAX_TEXT_LEN)
    errors.notes = `Keep it under ${MAX_TEXT_LEN} characters!`;

  if (!values.proof_completion.length)
    errors.proof_completion = "Upload proof of completion";

  const fsize = values.proof_completion?.[0]?.file?.size || 0;
  if (fsize > 1024 ** 2 * maxImgSizeMb)
    errors.proof_completion = `Can upload maximum ${maxImgSizeMb}MB (yours is ${(
      fsize /
      1024 ** 2
    ).toFixed(2)}MB)`;

  return errors;
};

export default function FormSubmitMap({ onSubmit, type, remakeOf }) {
  onSubmit = onSubmit || submitMap;
  type = type || "1";
  remakeOf = remakeOf || null;

  const [currentMap, setCurrentMap] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [showErrorCount, setShowErrorCount] = useState(false);
  const [success, setSuccess] = useState(false);
  const [openRules, setOpenRules] = useState(false);
  const accessToken = useDiscordToken();
  const submittableFormats = useFormatsWhere("create:map_submission");

  if (!accessToken) return null;

  if (submittableFormats.length === 0)
    return (
      <MessageBanned>It seems like you can't submit maps...</MessageBanned>
    );

  const handleSubmit = useCallback(
    async (values, { setErrors }) => {
      const code = values.code.match(codeRegex)[1].toUpperCase();
      const payload = {
        code,
        format: parseInt(values.type),
        notes: values.notes.length ? values.notes : null,
        proposed: parseInt(values.proposed),
        proof_completion: values.proof_completion[0].file,
      };

      const result = await onSubmit(accessToken.access_token, payload);
      if (result && Object.keys(result.errors).length) {
        setErrors(result.errors);
        return;
      }

      revalidateMapSubmissions();
      setSuccess(true);
    },
    [accessToken.access_token]
  );

  return (
    <Formik
      validate={validate}
      initialValues={{
        code: "",
        notes: "",
        type,
        proposed: remakeOf || "0",
        proof_completion: [],
      }}
      onSubmit={handleSubmit}
    >
      {(formikProps) => {
        const { handleSubmit, errors, setErrors, isSubmitting, values } =
          formikProps;

        let errorCount = Object.keys(errors).length;
        if ("" in errors) errorCount--;
        const disableInputs = isFetching || isSubmitting || success;

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
              className="addmap"
              data-cy="form-submit-map"
            >
              <MapCodeController
                name="code"
                isFetching={isFetching}
                setIsFetching={setIsFetching}
                currentMap={currentMap?.code}
                onMapSuccess={({ mapData, isMaplist }) => {
                  let submittableFormats = [];
                  let code = null;
                  if (isMaplist) {
                    submittableFormats = allFormats
                      .filter(({ plcKey }) => mapData[plcKey] === null)
                      .map(({ value }) => value);
                    code = mapData.code;
                  } else {
                    submittableFormats = allFormats.map(({ value }) => value);
                    code = mapData.id;
                  }

                  setCurrentMap({
                    code,
                    name: mapData.name,
                    submittableFormats,
                  });
                  if (submittableFormats.length === 0) {
                    setErrors({
                      ...errors,
                      code: "That map is already in all lists!",
                    });
                  }
                }}
                onMapFail={() =>
                  setErrors({
                    ...errors,
                    code: "No map with that code found",
                  })
                }
              />
              <div className="flex-hcenter">
                <button
                  type="button"
                  onClick={() => setOpenRules(!openRules)}
                  className="btn btn-primary fs-6"
                >
                  Map Submission Rules
                </button>
              </div>
              <LazyFade in={openRules} mountOnEnter={true} unmountOnExit={true}>
                <div>
                  <br />
                  <MapSubmissionRules on={parseInt(values.type)} />
                </div>
              </LazyFade>
              {currentMap && currentMap.submittableFormats.length > 0 && (
                <div data-cy="submit-map-fields">
                  <hr className="mb-5" />

                  <div className="row flex-row-space mt-5">
                    <div className="col-12 col-lg-6">
                      <Btd6Map
                        code={currentMap.code}
                        name={currentMap.name}
                        className="my-0"
                      />
                    </div>

                    <div className="col-12 col-lg-6">
                      <div className="panel h-100">
                        {success ? (
                          <SidebarSuccess type={type} />
                        ) : (
                          <>
                            <SidebarForm
                              submittableFormats={currentMap.submittableFormats}
                            />

                            <div className="mb-2 mt-4">
                              <div className="flex-hcenter flex-col-space">
                                <button
                                  className="btn btn-primary"
                                  type="submit"
                                  disabled={isSubmitting || disableInputs}
                                >
                                  Submit
                                </button>
                              </div>

                              {showErrorCount && errorCount > 0 && (
                                <p className="text-center text-danger font-border mt-1">
                                  There are {errorCount} fields to compile
                                  correctly
                                </p>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>

            <ErrorToast />
          </FormikContext.Provider>
        );
      }}
    </Formik>
  );
}

function SidebarForm({ submittableFormats }) {
  const formikProps = useContext(FormikContext);
  const {
    handleChange,
    handleBlur,
    values,
    touched,
    errors,
    disableInputs,
    setValues,
  } = formikProps;
  const formats = useMaplistFormats();
  const selectedFormat = formats.find(({ id }) => id == values.type);

  return (
    <div className="my-2" data-cy="sidebar-form">
      <div>
        <label className="form-label">Notes</label>
        <Input
          name="notes"
          type="textarea"
          rows={3}
          placeholder="Small description of the map, additional credits, etc..."
          value={values.notes}
          onChange={handleChange}
          onBlur={handleBlur}
          isInvalid={touched.notes && "notes" in errors}
          disabled={disableInputs}
          autoComplete="off"
        />
        <div className="invalid-feedback">{errors.notes}</div>
      </div>

      <div className="d-flex w-100 justify-content-between mt-3">
        <p className="my-0 align-self-center">Submit to</p>
        <div className="align-self-end">
          <Select
            name="type"
            value={values.type}
            onChange={(evt) => {
              setValues({
                ...values,
                type: evt.target.value,
                proposed: evt.target.value == 11 ? "1" : "0",
              });
            }}
            onBlur={handleBlur}
          >
            {formats
              .filter(
                ({ hidden, map_submission_status, id }) =>
                  !hidden &&
                  map_submission_status !== "closed" &&
                  submittableFormats.includes(id)
              )
              .map(({ id, name }) => (
                <option value={id} key={id}>
                  {name}
                </option>
              ))}
          </Select>
        </div>
      </div>

      <div className="d-flex w-100 justify-content-between mt-3">
        <p className="my-0 align-self-center">Proposed Category</p>
        <div className="align-self-end">
          {values.type == 11 ? (
            <NostalgiaPackSelect
              className="form-select"
              name="proposed"
              value={values.proposed}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          ) : (
            <Select
              className="form-select"
              name="proposed"
              value={values.proposed}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              {formats
                .find(({ id }) => id == values.type)
                .proposed_difficulties.map((name, idx) => (
                  <option key={name} value={idx}>
                    {name}
                  </option>
                ))}
            </Select>
          )}
        </div>
      </div>

      {selectedFormat.map_submission_status === "open_chimps" && (
        <div className="w-100 justify-content-between mt-3">
          <p className="text-center mb-0">Proof of completion</p>
          <p className="muted text-center">
            Upload an image of you (or someone) beating Round 100 on your own
            map
          </p>
          <DragFiles
            name="proof_completion"
            formats={imageFormats}
            limit={1}
            onChange={handleChange}
            value={values.proof_completion}
            className="w-100"
          >
            {values.proof_completion.length > 0 && (
              <div className="d-flex justify-content-center">
                <img
                  style={{ maxWidth: "100%" }}
                  src={values.proof_completion[0].objectUrl}
                />
              </div>
            )}
          </DragFiles>
          {touched.proof_completion && errors.proof_completion && (
            <p className="text-danger font-border text-center">
              {errors.proof_completion}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function SidebarSuccess({ type }) {
  return (
    <div className="h-100 flex-vcenter" data-cy="sidebar-success">
      <p className="text-center mb-0">
        <span className="lead">Your map has been submitted!</span>
        <br />
        <span className="muted">
          The list moderators will look at your map and add it if it gets
          approved.
        </span>
        <br />
        <Link href={type === "list" ? "/maplist" : "/expert-list"}>
          &laquo; Back to the list
        </Link>
      </p>
    </div>
  );
}
