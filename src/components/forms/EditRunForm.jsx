"use client";
import cssZoomedImg from "../utils/ZoomedImage.module.css";
import stylesMedals from "../maps/Medals.module.css";
import { FormikContext } from "@/contexts";
import { Formik } from "formik";
import { useContext, useState } from "react";
import AddableField from "./AddableField";
import DragFiles from "./DragFiles";
import { isInt, removeFieldCode } from "@/utils/functions";
import ZoomedImage from "../utils/ZoomedImage";
import ErrorToast from "./ErrorToast";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import Input from "./bootstrap/Input";
import CheckBox from "./bootstrap/CheckBox";
import Select from "./bootstrap/Select";
import { imageFormats, maxImgSizeMb } from "@/utils/file-formats";
import LazyToast from "../transitions/LazyToast";
import { AutoComplete } from "./form-components/AutoComplete";
import { useMaplistFormats } from "@/utils/hooks";

const defaultValues = {
  black_border: false,
  no_geraldo: false,
  user_ids: [{ uid: "", count: -1 }],
  is_lcc: false,
  format: "1",
  has_no_image: false,
  subm_proof: [],
  lcc: {
    leftover: "",
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
        ...defaultValues,
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
    }

    if (!completion && !values.has_no_image && !values.subm_proof.length) {
      errors["subm_proof"] = "Must upload an image";
    }

    const fileFields = {
      subm_proof: values.subm_proof,
    };
    for (const field of Object.keys(fileFields)) {
      const fsize = values[field]?.[0]?.file?.size || 0;
      if (fsize > 1024 ** 2 * maxImgSizeMb)
        errors[field] = `Can upload maximum ${maxImgSizeMb}MB (yours is ${(
          fsize /
          1024 ** 2
        ).toFixed(2)}MB)`;
    }

    return errors;
  };

  const handleSubmit = async (values, { setErrors }) => {
    const payload = {
      ...values,
      user_ids: removeFieldCode(values.user_ids).map(({ uid }) => uid),
      format: parseInt(values.format),
      lcc: values.is_lcc ? { leftover: parseInt(values.lcc.leftover) } : null,
      subm_proof: values.has_no_image ? null : values.subm_proof?.[0]?.file,
    };
    delete payload.is_lcc;
    delete payload.has_no_image;

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
        const { handleSubmit, setSubmitting, isSubmitting, errors, setErrors } =
          formikProps;
        const disableInputs =
          isSubmitting || (!completion && success) || completion?.deleted_on;
        let errorCount = Object.keys(errors).length;
        if ("" in errors) errorCount--;

        const handleDelete = async (_e) => {
          setSubmitting(true);
          setShowErrorCount(true);
          const errors = await onDelete();
          if (errors) setErrors(errors);
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
              data-cy="form-edit-completion"
            >
              <div className="row">
                <SubmissionData completion={completion} />
                <RunProperties isNew={!completion} />
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
                        type="button"
                        data-cy="btn-delete"
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

      <LazyToast
        bg="success"
        className="notification"
        show={success}
        onClose={() => setSuccess(false)}
        delay={4000}
        autohide
      >
        <div className="toast-body" data-cy="toast-success">
          Completion {completion ? "modified" : "submitted"} successfully!
        </div>
      </LazyToast>
    </>
  );
}

function RunProperties({ isNew }) {
  const formikProps = useContext(FormikContext);
  const {
    handleChange,
    handleBlur,
    values,
    setValues,
    setFieldValue,
    touched,
    errors,
    disableInputs,
  } = formikProps;
  const formats = useMaplistFormats();

  return (
    <div className="col-12 col-lg-6 mb-3">
      <div className="panel pt-2 pb-3">
        <h2 className="text-center">Run Properties</h2>

        <div className="d-flex justify-content-between mt-4 mb-3 w-100">
          <p className="mb-0 mt-1">Format</p>
          <div>
            <Select
              name="format"
              value={values.format}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={disableInputs}
              isInvalid={!!errors.format}
            >
              {formats.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </Select>
            <div className="invalid-feedback">{errors.format}</div>
          </div>
        </div>

        <CheckBox
          className={stylesMedals.medal_check}
          name="black_border"
          onChange={handleChange}
          value={values.black_border}
          checked={values.black_border}
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
          checked={values.no_geraldo}
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
              data-cy="form-group"
            >
              <div className="w-100">
                <AutoComplete
                  type={["user"]}
                  query={uid}
                  onAutocomplete={({ data }) =>
                    setFieldValue(`user_ids[${i}].uid`, data.name)
                  }
                >
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
                </AutoComplete>
                <div className="invalid-feedback">
                  {errors[`user_ids[${i}]`]}
                </div>
              </div>
              {values.user_ids.length > 1 && (
                <div>
                  <button
                    type="button"
                    className="btn btn-danger width-auto"
                    disabled={disableInputs}
                    onClick={(_e) =>
                      setValues({
                        ...values,
                        user_ids: values.user_ids.filter(
                          (_v, idx) => idx !== i
                        ),
                      })
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

        {isNew && (
          <div data-cy="form-group">
            <h3 className="text-center mt-3">Completion Image</h3>
            <CheckBox
              type="checkbox"
              name="has_no_image"
              onChange={handleChange}
              value={values.has_no_image}
              checked={values.has_no_image}
              disabled={disableInputs}
              label="This completion doesn't have an image"
            />
            {values.has_no_image && (
              <p className="muted">
                To guarantee integrity, submission images can't be added or
                edited after a completion has been submitted or inserted. If you
                don't add an image now, you won't be able to later.
              </p>
            )}

            <DragFiles
              name="subm_proof"
              formats={imageFormats}
              limit={1}
              onChange={handleChange}
              value={values.subm_proof}
              isValid={!("subm_proof" in errors) && values.subm_proof.length}
              disabled={disableInputs || values.has_no_image}
              className="w-100 mt-3"
            >
              {values.subm_proof.length > 0 && (
                <div className="d-flex justify-content-center">
                  <img
                    style={{ maxWidth: "100%" }}
                    src={values.subm_proof[0].objectUrl}
                  />
                </div>
              )}
            </DragFiles>
            {"subm_proof" in errors && (
              <p
                className="text-danger text-center my-1"
                data-cy="invalid-feedback"
              >
                {errors["subm_proof"]}
              </p>
            )}
          </div>
        )}
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
            type="button"
            onClick={() => setFieldValue("is_lcc", !values.is_lcc)}
            className={`btn btn-primary ${values.is_lcc ? "active" : ""}`}
            data-cy="btn-toggle-lcc"
          >
            LCC Properties
          </button>
        </div>

        <div className="d-flex justify-content-between mt-4 mb-3 w-100">
          <p className="mb-0 mt-1">Saveup</p>
          <div data-cy="form-group">
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
      </div>
    </div>
  );
}

function SubmissionData({ completion }) {
  const [isProofZoomed, setProofZoomed] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  if (
    !completion ||
    !(
      completion.subm_notes ||
      completion.subm_proof_img.length ||
      completion.subm_proof_vid.length
    )
  )
    return null;

  return (
    <div className="col-12 col-lg-6 mb-3" data-cy="submission-data">
      <div className="panel pt-2 pb-3">
        <h2 className="text-center">Submission Info</h2>
        {completion.subm_notes && (
          <p className="text-justify">{completion.subm_notes}</p>
        )}
        {(completion.subm_proof_img.length > 0 ||
          completion.subm_proof_vid.length > 0) && (
          <>
            <h3 className="text-center">Submitted Proof</h3>

            {completion.subm_proof_vid.length > 0 && (
              <>
                <p className="mb-0">Video Proof URLs:</p>

                <ol>
                  {completion.subm_proof_vid.map((url) => (
                    <li key={url}>
                      <a href={url} target="_blank">
                        {url}
                      </a>
                    </li>
                  ))}
                </ol>
              </>
            )}

            {completion.subm_proof_img.length > 0 && (
              <>
                <div className="p-relative">
                  {completion.subm_proof_img.length > 1 && (
                    <div
                      onClick={() =>
                        setImgIdx(
                          (imgIdx + 1) % completion.subm_proof_img.length
                        )
                      }
                      className={`shadow font-border ${cssZoomedImg.switch_image} ${cssZoomedImg.left}`}
                      data-cy="subm-proof-prev"
                    >
                      <i className="bi bi-chevron-left" />
                    </div>
                  )}

                  <img
                    src={completion.subm_proof_img[imgIdx]}
                    className="w-100 zoomable"
                    onClick={() => setProofZoomed(true)}
                    data-cy="subm-proof"
                  />

                  {completion.subm_proof_img.length > 1 && (
                    <div
                      onClick={() =>
                        setImgIdx(
                          (imgIdx + 1) % completion.subm_proof_img.length
                        )
                      }
                      className={`shadow font-border ${cssZoomedImg.switch_image} ${cssZoomedImg.right}`}
                      data-cy="subm-proof-next"
                    >
                      <i className="bi bi-chevron-right" />
                    </div>
                  )}
                </div>

                <ZoomedImage
                  key={imgIdx}
                  startIdx={imgIdx}
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
