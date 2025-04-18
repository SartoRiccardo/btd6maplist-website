"use client";
import { insertUser } from "@/server/maplistRequests.client";
import { useDiscordToken } from "@/utils/hooks";
import { Formik } from "formik";
import { useState } from "react";
import Input from "./bootstrap/Input";
import LazyToast from "../transitions/LazyToast";
import { validateUsername } from "@/utils/validators";

const defaultVals = {
  discord_id: "",
  name: "",
};

export default function AddUserForm() {
  const [success, setSuccess] = useState(false);
  const accessToken = useDiscordToken();

  const validate = (values) => {
    const errors = {};

    if (!values.discord_id.length)
      errors.discord_id = "Discord ID cannot be blank";
    else if (!/^\d+$/.test(values.discord_id))
      errors.discord_id = "Must be numeric";

    const nameError = validateUsername(values.name);
    if (nameError) errors.name = nameError;

    return errors;
  };

  const handleSubmit = async (values, { setErrors, setValues, resetForm }) => {
    const payload = { ...values };
    const result = await insertUser(accessToken.access_token, payload);
    if (result?.errors && Object.keys(result.errors).length) {
      setErrors(result.errors);
      return;
    }
    setValues({ ...defaultVals });
    setSuccess(true);
    resetForm();
  };

  return (
    <>
      <Formik
        onSubmit={handleSubmit}
        validate={validate}
        initialValues={{ ...defaultVals }}
      >
        {(formikProps) => {
          const {
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            errors,
            isSubmitting,
          } = formikProps;

          return (
            <form onSubmit={handleSubmit} data-cy="form-add-user">
              <div className="panel panel-container">
                <div className="row flex-row-space">
                  <div className="col-6">
                    <div data-cy="form-group">
                      <label className="form-label">Discord ID</label>
                      <Input
                        name="discord_id"
                        type="text"
                        placeholder="1077309729942024302"
                        value={values.discord_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={
                          touched.discord_id &&
                          (values.discord_id.length === 0 ||
                            "discord_id" in errors)
                        }
                        disabled={isSubmitting}
                        autoComplete="off"
                      />
                      <div className="invalid-feedback">
                        {errors.discord_id}
                      </div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div data-cy="form-group">
                      <label className="form-label">Username</label>
                      <Input
                        name="name"
                        type="text"
                        placeholder="chimenea.mo"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={
                          touched.name &&
                          (values.name.length === 0 || "name" in errors)
                        }
                        disabled={isSubmitting}
                        autoComplete="off"
                      />
                      <div className="invalid-feedback">{errors.name}</div>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-col-space justify-content-center mt-3">
                  <button
                    className="btn btn-primary"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    Insert
                  </button>
                </div>
              </div>
            </form>
          );
        }}
      </Formik>

      <LazyToast
        bg="success"
        className="notification"
        show={success}
        onClose={() => setSuccess(false)}
        delay={4000}
        autohide
      >
        <div className="toast-body" data-cy="toast-success">
          User inserted!
        </div>
      </LazyToast>
    </>
  );
}
