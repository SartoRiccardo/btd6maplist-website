"use client";
import { FormikContext } from "@/contexts";
import { Formik } from "formik";
import { useContext, useState } from "react";
import { Toast } from "react-bootstrap";
import AddableField from "./AddableField";
import DragFiles from "./DragFiles";
import { isInt, removeFieldCode } from "@/utils/functions";
import { allFormats } from "@/utils/maplistUtils";
import ZoomedImage from "../utils/ZoomedImage";
import ErrorToast from "./ErrorToast";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import Input from "./bootstrap/Input";
import CheckBox from "./bootstrap/CheckBox";

const defaultValues = {
  black_border: false,
  no_geraldo: false,
  user_ids: [{ uid: "", count: -1 }],
  is_lcc: false,
  format: "1",
  lcc: {
    leftover: "",
    proof_url: "",
    proof_file: [],
  },
};

export default function EditRunForm({ completion, onSubmit, onDelete }) {
  onSubmit = onSubmit || (async () => {});
  onDelete = onDelete || (async () => {});

  const [showErrorCount, setShowErrorCount] = useState(false);
  const [showDeleting, setShowDeleting] = useState(false);
  const [success, setSuccess] = useState(false);

  const initialValues = completion
    ? {
        black_border: completion.black_border,
        no_geraldo: completion.no_geraldo,
        user_ids: completion.users.map(({ name }, i) => ({
          uid: name,
          count: -(i + 1),
        })),
        is_lcc: !!completion.lcc,
        format: completion.format.toString(),
        lcc: {
          leftover: completion.lcc?.leftover
            ? completion.lcc.leftover.toString()
            : "",
          proof_url: completion.lcc?.proof || "",
          proof_file: [],
        },
      }
    : { ...defaultValues };

  const validate = (values) => {
    const errors = {};

    for (let i = 0; i < values.user_ids.length; i++) {
      if (!values.user_ids[i].uid.length)
        errors[`user_ids[${i}]`] = "This cannot be blank";
    }
    if (values.is_lcc) {
      if (!isInt(values.lcc.leftover) || parseInt(values.lcc.leftover) < 0)
        errors["lcc.leftover"] = "Must be a positive number";
      if (!values.lcc.proof_file.length && !values.lcc.proof_url.length) {
        errors["lcc.proof_file"] = "Must either upload image or URL";
        errors["lcc.proof_url"] = "Must either upload image or URL";
      }
    }

    const fsize = values.lcc.proof_file?.[0]?.file?.size || 0;
    if (fsize > 1024 ** 2 * 3)
      errors["lcc.proof_file"] = "Can upload maximum 2MB";

    return errors;
  };

  const handleSubmit = async (values, { setErrors }) => {
    const payload = {
      ...values,
      user_ids: removeFieldCode(values.user_ids).map(({ uid }) => uid),
      format: parseInt(values.format),
      lcc: values.is_lcc
        ? {
            leftover: parseInt(values.lcc.leftover),
            proof_completion:
              values.lcc.proof_url || values.lcc.proof_file[0].file,
          }
        : null,
    };
    delete payload.is_lcc;

    const result = await onSubmit(payload);
    if (result && Object.keys(result.errors).length) {
      setErrors(result.errors);
      return;
    }
    setSuccess(true);
  };

  const form = (
    <Formik
      validate={validate}
      onSubmit={handleSubmit}
      initialValues={initialValues}
    >
      {(formikProps) => {
        const { handleSubmit, setSubmitting, isSubmitting, errors } =
          formikProps;
        const disableInputs =
          isSubmitting || (!completion && success) || completion?.deleted_on;
        let errorCount = Object.keys(errors).length;
        if ("" in errors) errorCount--;

        const handleDelete = async (_e) => {
          setSubmitting(true);
          await onDelete();
          setSubmitting(false);
        };

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
            >
              <div className="row">
                <SubmissionData completion={completion} />
                <RunProperties />
                <LCCProperties />
              </div>

              <div className="flex-hcenter flex-col-space">
                {completion ? (
                  completion.deleted_on ? (
                    <p className="muted">
                      This is a deleted run, it will not be counted, you cannot
                      edit it.
                    </p>
                  ) : (
                    <>
                      <button
                        disabled={disableInputs}
                        className="btn btn-danger big"
                        onClick={() => setShowDeleting(true)}
                      >
                        {completion.accepted_by ? "Delete" : "Reject"}
                      </button>
                      <button
                        className="btn btn-primary"
                        disabled={disableInputs}
                        type="submit"
                      >
                        {completion.accepted_by ? "Save" : "Approve"}
                      </button>
                    </>
                  )
                ) : (
                  <button
                    className="btn btn-primary"
                    disabled={disableInputs}
                    type="submit"
                  >
                    Submit
                  </button>
                )}
              </div>

              {showErrorCount && errorCount > 0 && (
                <p className="text-center text-danger mt-3">
                  There are {errorCount} fields to compile correctly
                </p>
              )}
            </form>

            <ConfirmDeleteModal
              disabled={disableInputs}
              show={showDeleting}
              onHide={() => setShowDeleting(false)}
              entity="completion"
              onDelete={handleDelete}
            />
            <ErrorToast />
          </FormikContext.Provider>
        );
      }}
    </Formik>
  );

  return (
    <>
      {form}

      <Toast
        bg="success"
        className="notification"
        show={success}
        onClose={() => setSuccess(false)}
        delay={4000}
        autohide
      >
        <Toast.Body>
          Completion {completion ? "modified" : "submitted"} successfully!
        </Toast.Body>
      </Toast>
    </>
  );
}

function RunProperties() {
  const formikProps = useContext(FormikContext);
  const {
    handleChange,
    handleBlur,
    values,
    setValues,
    touched,
    errors,
    disableInputs,
  } = formikProps;

  return (
    <div className="col-12 col-lg-6 mb-3">
      <div className="panel pt-2 pb-3">
        <h2 className="text-center">Run Properties</h2>

        <div className="d-flex justify-content-between mt-4 mb-3 w-100">
          <p className="mb-0 mt-1">Format</p>
          <div>
            <select
              className="form-select"
              name="format"
              value={values.format}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={disableInputs}
              isInvalid={!!errors.format}
            >
              {allFormats.map(({ value, name }) => (
                <option key={value} value={value}>
                  {name}
                </option>
              ))}
            </select>
            <div className="invalid-feedback">{errors.format}</div>
          </div>
        </div>

        <CheckBox
          className="medal-check"
          name="black_border"
          onChange={handleChange}
          value={values.black_border}
          checked={values.black_border}
          disabled={disableInputs}
          label={
            <span>
              <img src="/medals/medal_bb.webp" className="inline-medal" />
              &nbsp; Black Border
            </span>
          }
        />
        <CheckBox
          className="medal-check my-2"
          name="no_geraldo"
          onChange={handleChange}
          value={values.no_geraldo}
          checked={values.no_geraldo}
          disabled={disableInputs}
          label={
            <span>
              <img src="/medals/medal_nogerry.webp" className="inline-medal" />
              &nbsp; No Optimal Hero
            </span>
          }
        />

        <h3 className="text-center">Player(s)</h3>
        <AddableField
          disabled={disableInputs}
          name="user_ids"
          defaultValue={{ uid: "" }}
        >
          {values.user_ids.map(({ count, uid }, i) => (
            <div
              key={count}
              className="flex-hcenter flex-col-space px-0 px-md-5 mb-2"
            >
              <div className="w-100">
                <Input
                  name={`user_ids[${i}].uid`}
                  type="text"
                  placeholder="Maplist Username or Discord ID"
                  value={uid}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.user_ids && `user_ids[${i}]` in errors}
                  disabled={disableInputs}
                  autoComplete="off"
                />
                <div className="invalid-feedback">
                  {errors[`user_ids[${i}]`]}
                </div>
              </div>
              {values.user_ids.length > 1 && (
                <div>
                  <button
                    className="btn btn-danger"
                    disabled={disableInputs}
                    onClick={(_e) =>
                      setValues({
                        ...values,
                        user_ids: values.user_ids.filter(
                          (_v, idx) => idx !== i
                        ),
                      })
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
    </div>
  );
}

function LCCProperties() {
  const formikProps = useContext(FormikContext);
  const {
    handleChange,
    handleBlur,
    values,
    setFieldValue,
    touched,
    errors,
    disableInputs,
  } = formikProps;
  const disableLccInputs = disableInputs || !values.is_lcc;

  return (
    <div className="col-12 col-lg-6 mb-3">
      <div className={`panel py-3 ${!values.is_lcc && "disabled"}`}>
        <div className="flex-hcenter no-disable">
          <button
            onClick={() => setFieldValue("is_lcc", !values.is_lcc)}
            className={`btn btn-primary ${values.is_lcc ? "active" : ""}`}
          >
            LCC Properties
          </button>
        </div>

        <div className="d-flex justify-content-between mt-4 mb-3 w-100">
          <p className="mb-0 mt-1">Saveup</p>
          <div>
            <Input
              name="lcc.leftover"
              type="text"
              placeholder="40870"
              value={values.lcc.leftover}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.lcc && "lcc.leftover" in errors}
              disabled={disableLccInputs}
              autoComplete="off"
            />
            <div className="invalid-feedback">{errors["lcc.leftover"]}</div>
          </div>
        </div>

        <h3 className="text-center mb-1">Proof</h3>
        <p className="text-center muted">
          Insert either an image URL or upload an image
        </p>

        <div className="d-flex justify-content-between my-3 w-100">
          <p className="mb-0 mt-1">Proof URL</p>
          <div>
            <Input
              name="lcc.proof_url"
              type="url"
              placeholder="https://drive.com/..."
              value={values.lcc.proof_url}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.lcc && "lcc.proof_url" in errors}
              isValid={
                values.is_lcc &&
                !("lcc.proof_url" in errors) &&
                values.lcc.proof_url.length > 0
              }
              disabled={disableLccInputs}
              autoComplete="off"
            />
            <div className="invalid-feedback">{errors["lcc.proof_url"]}</div>
          </div>
        </div>

        <DragFiles
          name="lcc.proof_file"
          formats={["jpg", "png", "webp"]}
          limit={1}
          onChange={(evt) => {
            setFieldValue("lcc.proof_url", "");
            handleChange(evt);
          }}
          value={values.lcc.proof_file}
          isValid={
            values.is_lcc &&
            !("lcc.proof_file" in errors) &&
            !values.lcc.proof_url.length
          }
          disabled={disableLccInputs}
          className="w-100"
        >
          {values.lcc.proof_file.length > 0 && (
            <div className="d-flex justify-content-center">
              <img
                style={{ maxWidth: "100%" }}
                src={values.lcc.proof_file[0].objectUrl}
              />
            </div>
          )}
        </DragFiles>
        {"lcc.proof_file" in errors && (
          <p className="text-danger text-center my-1">
            {errors["lcc.proof_file"]}
          </p>
        )}
      </div>
    </div>
  );
}

function SubmissionData({ completion }) {
  const [isProofZoomed, setProofZoomed] = useState(false);

  if (
    !completion ||
    !(
      completion.subm_notes ||
      completion.subm_proof_img ||
      completion.subm_proof_vid
    )
  )
    return null;

  return (
    <div className="col-12 col-lg-6 mb-3">
      <div className="panel pt-2 pb-3">
        <h2 className="text-center">Submission Info</h2>
        {completion.subm_notes && (
          <p className="text-justify">{completion.subm_notes}</p>
        )}
        {(completion.subm_proof_img || completion.subm_proof_vid) && (
          <>
            <h3 className="text-center">Submitted Proof</h3>
            {completion.subm_proof_vid && (
              <p>
                Video Proof URL:{" "}
                <a href={completion.subm_proof_vid} target="_blank">
                  {completion.subm_proof_vid}
                </a>
              </p>
            )}
            {completion.subm_proof_img && (
              <>
                <img
                  src={completion.subm_proof_img}
                  className="w-100 zoomable"
                  onClick={() => setProofZoomed(true)}
                />
                <ZoomedImage
                  src={completion.subm_proof_img}
                  show={isProofZoomed}
                  onHide={() => setProofZoomed(false)}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
