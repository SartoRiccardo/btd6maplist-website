"use client";
import cssDragF from "./DragFiles.module.css";
import stylesMedals from "../maps/Medals.module.css";
import { Formik } from "formik";
import { useCallback, useContext, useState } from "react";
import {
  useDiscordToken,
  useHasPerms,
  useMaplistConfig,
  useMaplistFormats,
} from "@/utils/hooks";
import { FormikContext } from "@/contexts";
import DragFiles from "./DragFiles";
import { formatToKey } from "@/utils/maplistUtils";
import { submitRun } from "@/server/maplistRequests.client";
import Link from "next/link";
import { RunSubmissionRules } from "../layout/maplists/MaplistRules";
import ErrorToast from "./ErrorToast";
import Input from "./bootstrap/Input";
import { imageFormats, maxImgSizeMb } from "@/utils/file-formats";
import LazyFade from "../transitions/LazyFade";
import AddableField from "./AddableField";
import { removeFieldCode } from "@/utils/functions";
import MessageBanned from "../ui/MessageBanned";
import CheckBox from "./bootstrap/CheckBox";

const MAX_TEXT_LEN = 500;

export default function SubmitRunForm({ onSubmit, mapData }) {
  onSubmit = onSubmit || submitRun;

  const maplistCfg = useMaplistConfig();
  const [showErrorCount, setShowErrorCount] = useState(false);
  const [success, setSuccess] = useState(false);
  const [openRules, setOpenRules] = useState(false);
  const accessToken = useDiscordToken();
  const hasPerms = useHasPerms();
  const submittableFormats = useMaplistFormats().filter(
    ({ run_submission_status, hidden, id }) =>
      !hidden &&
      run_submission_status !== "closed" &&
      mapData?.[formatToKey?.[id]] &&
      hasPerms("create:completion_submission", { format: id })
  );

  const requiresVideoProof = useCallback(
    ({ black_border, no_geraldo, current_lcc, format }) => {
      format = parseInt(format);
      return (
        hasPerms("require:completion_submission:recording") ||
        black_border ||
        current_lcc ||
        (no_geraldo &&
          (!(50 <= format && format < 100) ||
            (50 <= format &&
              format < 100 &&
              !(0 <= mapData.difficulty && mapData.difficulty <= 2))))
      );
    },
    [mapData]
  );

  const validate = useCallback(
    (values) => {
      const errors = {};
      if (values.notes.length > MAX_TEXT_LEN)
        errors.notes = `Keep it under ${MAX_TEXT_LEN} characters!`;

      for (let i = 0; i < values.proof_completion.length; i++) {
        const file = values.proof_completion[i].file;
        if (!file.length)
          errors[`proof_completion[${i}]`] = "Upload proof of completion";

        const fsize = file?.[0]?.file?.size || 0;
        if (fsize > 1024 ** 2 * maxImgSizeMb)
          errors[
            `proof_completion[${i}]`
          ] = `Can upload maximum ${maxImgSizeMb}MB (yours is ${(
            fsize /
            1024 ** 2
          ).toFixed(2)}MB)`;
      }

      if (requiresVideoProof(values)) {
        // TODO check dupes
        for (let i = 0; i < values.video_proof_url.length; i++) {
          const url = values.video_proof_url[i].url;
          if (!url.length)
            errors[`video_proof_url[${i}]`] = "Please insert an URL!";
        }
      }

      if (values.current_lcc && (values.leftover === "" || values.leftover < 0))
        errors.leftover = "Must be a positive number";

      return errors;
    },
    [requiresVideoProof]
  );

  const handleSubmit = useCallback(
    async (values, { setErrors }) => {
      const payload = {
        ...values,
        notes: values.notes.length ? values.notes : null,
        format: parseInt(values.format),
        code: mapData.code,
        proof_completion: removeFieldCode(values.proof_completion)
          .filter(({ file }) => file.length)
          .map(({ file }) => file[0].file),
        video_proof_url: removeFieldCode(values.video_proof_url).map(
          ({ url }) => url
        ),
      };
      if (!requiresVideoProof(values)) payload.video_proof_url = [];

      const result = await onSubmit(accessToken.access_token, payload);
      if (result && Object.keys(result.errors).length) {
        setErrors(result.errors);
        return;
      }
      setSuccess(true);
    },
    [accessToken.access_token, requiresVideoProof]
  );

  if (submittableFormats.length === 0 || mapData.deleted_on) {
    return (
      <MessageBanned>This map no longer accepts submissions!</MessageBanned>
    );
  }

  if (!accessToken) return null;

  const form = (
    <Formik
      validate={validate}
      initialValues={{
        proof_completion: [{ count: -1, file: [] }],
        format: submittableFormats[0].id.toString(),
        notes: "",
        black_border: false,
        no_geraldo: false,
        current_lcc: submittableFormats[0].run_submission_status === "lcc_only",
        video_proof_url: [{ count: -1, url: "" }],
        leftover: "",
      }}
      onSubmit={handleSubmit}
    >
      {(formikProps) => {
        const {
          handleSubmit,
          handleChange,
          touched,
          values,
          setFieldValue,
          errors,
          isSubmitting,
        } = formikProps;

        let errorCount = Object.keys(errors).length;
        if ("" in errors) errorCount--;
        const disableInputs = isSubmitting || success;

        return (
          <FormikContext.Provider
            value={{ ...formikProps, disableInputs, requiresVideoProof }}
            key={0}
          >
            <form
              onSubmit={(evt) => {
                setShowErrorCount(true);
                handleSubmit(evt);
              }}
              data-cy="form-submit-completion"
            >
              <div className="row flex-row-space mt-5">
                <div className="col-12 col-lg-6">
                  {success ? (
                    <div className="panel pt-3 pb-0 flex-hcenter">
                      <img src="/misc/victory.webp" width={200} />
                    </div>
                  ) : (
                    <div className="panel py-3">
                      <h2 className="text-center">Proof of Completion</h2>

                      <AddableField
                        disabled={disableInputs}
                        name="proof_completion"
                        defaultValue={{ file: [] }}
                        maxAmount={4}
                        currentAmount={values.proof_completion.length}
                        w100
                      >
                        {values.proof_completion.map(({ count, file }, i) => (
                          <div
                            className={`p-relative ${i > 0 ? "mt-4" : ""}`}
                            key={count}
                          >
                            <DragFiles
                              name={`proof_completion[${i}].file`}
                              formats={imageFormats}
                              limit={1}
                              onChange={handleChange}
                              value={file}
                              className="w-100"
                            >
                              {file.length > 0 && (
                                <div className="d-flex justify-content-center">
                                  <img
                                    style={{ maxWidth: "100%" }}
                                    src={file[0].objectUrl}
                                  />
                                </div>
                              )}
                            </DragFiles>

                            {values.proof_completion.length > 1 && (
                              <div className={cssDragF.remove}>
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  disabled={disableInputs}
                                  onClick={(_e) =>
                                    setFieldValue(
                                      "proof_completion",
                                      values.proof_completion.filter(
                                        (_v, idx) => idx !== i
                                      )
                                    )
                                  }
                                  data-cy="btn-remove-field"
                                >
                                  <i className="bi bi-dash" />
                                </button>
                              </div>
                            )}

                            {touched.proof_completion &&
                              errors[`proof_completion[${i}]`] && (
                                <p
                                  className="text-danger font-border text-center"
                                  data-cy="invalid-feedback"
                                >
                                  {errors[`proof_completion[${i}]`]}
                                </p>
                              )}
                          </div>
                        ))}
                      </AddableField>
                    </div>
                  )}
                </div>

                <div className="col-12 col-lg-6">
                  <div className="panel h-100">
                    {success ? (
                      <SidebarSuccess formats={submittableFormats} />
                    ) : (
                      <>
                        <SidebarForm formats={submittableFormats} />

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
                              There are {errorCount} fields to compile correctly
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </form>

            <ErrorToast />
          </FormikContext.Provider>
        );
      }}
    </Formik>
  );

  return (
    <>
      <div className="flex-hcenter">
        <button
          type="button"
          onClick={() => setOpenRules(!openRules)}
          className="btn btn-primary fs-6"
        >
          Run Submission Rules
        </button>
      </div>

      <LazyFade in={openRules} mountOnEnter={true} unmountOnExit={true}>
        <div>
          <br />
          {/* <RunSubmissionRules
            on={humptyDumpty.includes(3) ? "experts" : "list"}
          /> */}
        </div>
      </LazyFade>

      {form}
    </>
  );
}

function SidebarForm({ formats }) {
  const formikProps = useContext(FormikContext);
  const {
    handleChange,
    handleBlur,
    values,
    touched,
    errors,
    disableInputs,
    requiresVideoProof,
    setFieldValue,
  } = formikProps;
  const curFormat = formats.find(({ id }) => id === parseInt(values.format));

  return (
    <div className="my-2">
      {formats.length > 1 && (
        <div className="d-flex w-100 justify-content-between mt-3">
          <p className=" align-self-center">Format</p>
          <div className="align-self-end">
            <select
              className="form-select"
              name="format"
              value={values.proposed}
              onChange={(evt) => {
                const newFormat = formats.find(
                  ({ id }) => id === parseInt(evt.target.value)
                );
                if (newFormat.run_submission_status === "lcc_only")
                  setFieldValue("current_lcc", true);
                setFieldValue(evt.target.name, evt.target.value);
              }}
              onBlur={handleBlur}
            >
              {formats.map(({ name, id }) => (
                <option value={id} key={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div data-cy="fgroup-notes">
        <label className="form-label">Notes</label>
        <Input
          name="notes"
          type="textarea"
          rows={3}
          placeholder="Anything particular you want to say about your run, if any."
          value={values.notes}
          onChange={handleChange}
          onBlur={handleBlur}
          isInvalid={touched.notes && "notes" in errors}
          disabled={disableInputs}
          autoComplete="off"
        />
        <div className="invalid-feedback">{errors.notes}</div>
      </div>

      <h3 className="text-center mt-2">Run Properties</h3>
      <div className="mb-2 pb-3">
        {curFormat.run_submission_status !== "lcc_only" && (
          <>
            <CheckBox
              className={stylesMedals.medal_check}
              name="black_border"
              onChange={handleChange}
              value={values.black_border}
              disabled={disableInputs}
              label={
                <span>
                  <img
                    src="/medals/medal_bb.webp"
                    className={stylesMedals.inline_medal}
                  />
                  &nbsp; Black Border
                </span>
              }
            />

            <CheckBox
              className={`${stylesMedals.medal_check} my-2`}
              name="no_geraldo"
              onChange={handleChange}
              value={values.no_geraldo}
              disabled={disableInputs}
              label={
                <span>
                  <img
                    src="/medals/medal_nogerry.webp"
                    className={stylesMedals.inline_medal}
                  />
                  &nbsp; No Optimal Hero
                </span>
              }
            />
          </>
        )}

        <CheckBox
          className={stylesMedals.medal_check}
          name="current_lcc"
          onChange={handleChange}
          value={values.current_lcc}
          disabled={
            disableInputs || curFormat.run_submission_status === "lcc_only"
          }
          label={
            <span>
              <img
                src="/medals/medal_lcc.webp"
                className={stylesMedals.inline_medal}
              />
              &nbsp; Least Cash CHIMPS
            </span>
          }
        />
      </div>

      {values.current_lcc && (
        <div className="mt-2" data-cy="fgroup-leftover">
          <label className="form-label">LCC Saveup</label>
          <Input
            type="number"
            name="leftover"
            value={values.leftover}
            isInvalid={touched.leftover && "leftover" in errors}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <div className="invalid-feedback">{errors.leftover}</div>
        </div>
      )}

      {requiresVideoProof(values) && (
        <div className="mt-2">
          <label className="form-label">Video Proof URL</label>
          <AddableField
            disabled={disableInputs}
            name="video_proof_url"
            defaultValue={{ url: "" }}
            maxAmount={5}
            currentAmount={values.video_proof_url.length}
          >
            {values.video_proof_url.map(({ count, url }, i) => (
              <div key={count} className="d-flex flex-col-space px-0 mb-2">
                <div className="w-100">
                  <Input
                    name={`video_proof_url[${i}].url`}
                    type="url"
                    placeholder="https://youtube.com/..."
                    value={url}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={
                      touched.video_proof_url &&
                      `video_proof_url[${i}]` in errors
                    }
                    disabled={disableInputs}
                    autoComplete="off"
                  />
                  <div className="invalid-feedback">
                    {errors[`video_proof_url[${i}]`]}
                  </div>
                </div>

                {values.video_proof_url.length > 1 && (
                  <div>
                    <button
                      type="button"
                      className="btn btn-danger"
                      disabled={disableInputs}
                      onClick={(_e) =>
                        setFieldValue(
                          "video_proof_url",
                          values.video_proof_url.filter((_v, idx) => idx !== i)
                        )
                      }
                      data-cy="btn-remove-field"
                    >
                      <i className="bi bi-dash" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </AddableField>
        </div>
      )}
    </div>
  );
}

function SidebarSuccess({ formats }) {
  let href = "/maplist";
  for (const fmt of formats) {
    if (fmt >= 50) href = "/expert-list";
  }

  return (
    <div className="h-100 flex-vcenter py-4">
      <p className="text-center mb-0">
        <span className="lead">Your run has been submitted!</span>
        <br />
        <span className="muted">
          The list moderators will look at your run and add it if it gets
          approved.
        </span>
        <br />
        <Link href={href}>&laquo; Back to the list</Link>
      </p>
    </div>
  );
}
