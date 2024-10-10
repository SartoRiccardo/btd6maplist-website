"use client";
import cssDragF from "./DragFiles.module.css";
import stylesMedals from "../maps/Medals.module.css";
import { Formik } from "formik";
import { useContext, useState } from "react";
import {
  useAuthLevels,
  useDiscordToken,
  useMaplistConfig,
} from "@/utils/hooks";
import { FormikContext } from "@/contexts";
import DragFiles from "./DragFiles";
import { listVersions } from "@/utils/maplistUtils";
import { submitRun } from "@/server/maplistRequests.client";
import Link from "next/link";
import { RunSubmissionRules } from "../layout/maplists/MaplistRules";
import ErrorToast from "./ErrorToast";
import Input from "./bootstrap/Input";
import { imageFormats } from "@/utils/file-formats";
import LazyFade from "../transitions/LazyFade";
import AddableField from "./AddableField";
import { removeFieldCode } from "@/utils/functions";

const MAX_TEXT_LEN = 500;

export default function SubmitRunForm({ onSubmit, mapData }) {
  onSubmit = onSubmit || submitRun;

  const maplistCfg = useMaplistConfig();
  const [showErrorCount, setShowErrorCount] = useState(false);
  const [success, setSuccess] = useState(false);
  const [openRules, setOpenRules] = useState(false);
  const accessToken = useDiscordToken();
  const authLevels = useAuthLevels();

  const formats = [];
  if (
    mapData.placement_cur > 0 &&
    mapData.placement_cur <= maplistCfg.map_count
  )
    formats.push(1);
  if (
    mapData.placement_all > 0 &&
    mapData.placement_all <= maplistCfg.map_count
  )
    formats.push(2);
  if (mapData.difficulty > -1) formats.push(51);

  if (!formats.length || mapData.deleted_on) {
    return (
      <p className="lead text-center muted">
        This map no longer accepts submissions, as it was either deleted or
        pushed off the list!
      </p>
    );
  }

  if (!accessToken) return null;

  const requiresVideoProof = ({ black_border, no_geraldo, current_lcc }) => {
    return (
      authLevels.requiresRecording || black_border || no_geraldo || current_lcc
    );
  };

  const validate = (values) => {
    const errors = {};
    if (values.notes.length > MAX_TEXT_LEN)
      errors.notes = `Keep it under ${MAX_TEXT_LEN} characters!`;

    for (let i = 0; i < values.proof_completion.length; i++) {
      const file = values.proof_completion[i].file;
      if (!file.length)
        errors[`proof_completion[${i}]`] = "Upload proof of completion";

      const fsize = file?.[0]?.file?.size || 0;
      if (fsize > 1024 ** 2 * 3)
        errors[`proof_completion[${i}]`] = `Can upload maximum 3MB (yours is ${(
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
  };

  const handleSubmit = async (values, { setErrors }) => {
    const payload = {
      ...values,
      format: parseInt(values.format),
      code: mapData.code,
      proof_completion: removeFieldCode(values.proof_completion)
        .filter(({ file }) => file.length)
        .map(({ file }) => file[0].file),
      video_proof_url: removeFieldCode(values.video_proof_url).map(
        ({ url }) => url
      ),
    };
    if (!requiresVideoProof(values)) delete payload.video_proof_url;

    const result = await onSubmit(accessToken.access_token, payload);
    if (result && Object.keys(result.errors).length) {
      setErrors(result.errors);
      return;
    }
    setSuccess(true);
  };

  const form = (
    <Formik
      validate={validate}
      initialValues={{
        proof_completion: [{ count: -1, file: [] }],
        format: formats[0].toString(),
        notes: "",
        black_border: false,
        no_geraldo: false,
        current_lcc: false,
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
                                >
                                  <i className="bi bi-dash" />
                                </button>
                              </div>
                            )}

                            {touched.proof_completion &&
                              errors[`proof_completion[${i}]`] && (
                                <p className="text-danger text-center">
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
                      <SidebarSuccess />
                    ) : (
                      <SidebarForm formats={formats} />
                    )}
                  </div>
                </div>
              </div>

              {!success && (
                <>
                  <div className="flex-hcenter flex-col-space mt-5">
                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={isSubmitting || disableInputs}
                    >
                      Submit
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
          <RunSubmissionRules on={formats.includes(3) ? "experts" : "list"} />
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
  const validFormats = formats
    .map((frm) => listVersions.find(({ value }) => value === frm))
    .filter((x) => !!x);

  return (
    <div className="my-2">
      {validFormats.length > 1 && (
        <div className="d-flex w-100 justify-content-between mt-3">
          <p className=" align-self-center">Format</p>
          <div className="align-self-end">
            <select
              className="form-select"
              name="format"
              value={values.proposed}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              {validFormats.map(({ name, value }) => (
                <option value={value} key={value}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div>
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
      <div className={`${stylesMedals.medal_check} form-check`}>
        <Input
          type="checkbox"
          name="black_border"
          onChange={handleChange}
          value={values.black_border}
        />
        <label className="form-check-label">
          <span>
            <img
              src="/medals/medal_bb.webp"
              className={stylesMedals.inline_medal}
            />
            &nbsp; Black Border
          </span>
        </label>
      </div>

      <div className={`${stylesMedals.medal_check} form-check my-2`}>
        <Input
          type="checkbox"
          name="no_geraldo"
          onChange={handleChange}
          value={values.no_geraldo}
        />
        <label className="form-check-label">
          <span>
            <img
              src="/medals/medal_nogerry.webp"
              className={stylesMedals.inline_medal}
            />
            &nbsp; No Optimal Hero
          </span>
        </label>
      </div>

      <div className={`${stylesMedals.medal_check} form-check`}>
        <Input
          type="checkbox"
          name="current_lcc"
          onChange={handleChange}
          value={values.current_lcc}
        />
        <label className="form-check-label">
          <span>
            <img
              src="/medals/medal_lcc.webp"
              className={stylesMedals.inline_medal}
            />
            &nbsp; Least Cash CHIMPS
          </span>
        </label>
      </div>

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

      {values.current_lcc && (
        <div className="mt-2">
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
    </div>
  );
}

function SidebarSuccess() {
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
        <Link href="/list">&laquo; Back to the list</Link>
      </p>
    </div>
  );
}
