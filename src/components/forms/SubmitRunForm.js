"use client";
import { Formik } from "formik";
import { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDiscordToken, useMaplistConfig } from "@/utils/hooks";
import { FormikContext } from "@/contexts";
import DragFiles from "./DragFiles";
import { listVersions } from "@/utils/maplistUtils";
import { submitRun } from "@/server/maplistRequests.client";
import Link from "next/link";

const MAX_TEXT_LEN = 500;

export default function SubmitRunForm({ onSubmit, mapData }) {
  onSubmit = onSubmit || submitRun;

  const maplistCfg = useMaplistConfig();
  const [showErrorCount, setShowErrorCount] = useState(false);
  const [success, setSuccess] = useState(false);
  const accessToken = useDiscordToken();

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
  if (mapData.difficulty > -1) formats.push(3);

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
    return black_border || no_geraldo || current_lcc;
  };

  const validate = (values) => {
    const errors = {};
    if (values.notes.length > MAX_TEXT_LEN)
      errors.notes = `Keep it under ${MAX_TEXT_LEN} characters!`;

    if (!values.proof_completion.length)
      errors.proof_completion = "Upload proof of completion";

    if (requiresVideoProof(values) && !values.video_proof_url.length)
      errors.video_proof_url = "Submit a valid video proof of your run!";

    return errors;
  };

  const handleSubmit = async (values, { setErrors }) => {
    const payload = {
      ...values,
      format: parseInt(values.format),
      code: mapData.code,
      proof_completion: values.proof_completion[0].file,
    };
    if (!requiresVideoProof(values)) delete payload.video_proof_url;

    const result = await onSubmit(accessToken.access_token, payload);
    if (result && Object.keys(result.errors).length) {
      setErrors(result.errors);
      console.log(result.errors);
      return;
    }
    setSuccess(true);
  };

  return (
    <Formik
      validate={validate}
      initialValues={{
        proof_completion: [],
        format: formats[0].toString(),
        notes: "",
        black_border: false,
        no_geraldo: false,
        current_lcc: false,
        video_proof_url: "",
      }}
      onSubmit={handleSubmit}
    >
      {(formikProps) => {
        const {
          handleSubmit,
          handleChange,
          touched,
          values,
          errors,
          isSubmitting,
        } = formikProps;

        let errorCount = Object.keys(errors).length;
        const disableInputs = isSubmitting || success;

        return (
          <FormikContext.Provider
            value={{ ...formikProps, disableInputs, requiresVideoProof }}
            key={0}
          >
            <Form
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
                      <DragFiles
                        name="proof_completion"
                        formats={["jpg", "png", "webp"]}
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
                        <p className="text-danger text-center">
                          {errors.proof_completion}
                        </p>
                      )}
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
                    <Button
                      type="submit"
                      disabled={isSubmitting || disableInputs}
                    >
                      Submit
                    </Button>
                  </div>

                  {showErrorCount && errorCount > 0 && (
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
  } = formikProps;

  return (
    <div className="my-2">
      {formats.length > 1 && (
        <div className="d-flex w-100 justify-content-between mt-3">
          <p className=" align-self-center">Format</p>
          <div className="align-self-end">
            <Form.Select
              name="format"
              value={values.proposed}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              {formats.map((frm) => (
                <option value={frm} key={frm}>
                  {listVersions.find(({ value }) => value === frm).name}
                </option>
              ))}
            </Form.Select>
          </div>
        </div>
      )}

      <Form.Group>
        <Form.Label>Notes</Form.Label>
        <Form.Control
          name="notes"
          as="textarea"
          rows={3}
          placeholder="Anything particular you want to say about your run, if any."
          value={values.notes}
          onChange={handleChange}
          onBlur={handleBlur}
          isInvalid={touched.notes && "notes" in errors}
          disabled={disableInputs}
          autoComplete="off"
        />
        <Form.Control.Feedback type="invalid">
          {errors.notes}
        </Form.Control.Feedback>
      </Form.Group>

      <h3 className="text-center mt-2">Run Properties</h3>
      <Form.Check
        type="checkbox"
        className="medal-check"
        name="black_border"
        onChange={handleChange}
        value={values.black_border}
        label={
          <span>
            <img src="/medal_bb.webp" className="inline-medal" />
            &nbsp; Black Border
          </span>
        }
      />
      <Form.Check
        type="checkbox"
        className="medal-check my-2"
        name="no_geraldo"
        onChange={handleChange}
        value={values.no_geraldo}
        label={
          <span>
            <img src="/medal_nogerry.png" className="inline-medal" />
            &nbsp; No Optimal Hero
          </span>
        }
      />
      <Form.Check
        type="checkbox"
        className="medal-check"
        name="current_lcc"
        onChange={handleChange}
        value={values.current_lcc}
        label={
          <span>
            <img src="/medal_lcc.webp" className="inline-medal" />
            &nbsp; Least Cash CHIMPS
          </span>
        }
      />

      {requiresVideoProof(values) && (
        <Form.Group className="mt-2">
          <Form.Label>Video Proof URL</Form.Label>
          <Form.Control
            type="text"
            name="video_proof_url"
            value={values.video_proof_url}
            isInvalid={touched.video_proof_url && "video_proof_url" in errors}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Form.Control.Feedback type="invalid">
            {errors.video_proof_url}
          </Form.Control.Feedback>
        </Form.Group>
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
