"use client";
import { insertUser } from "@/server/maplistRequests.client";
import { useDiscordToken } from "@/utils/hooks";
import { Formik } from "formik";
import { useState } from "react";
import { Button, Form, Toast } from "react-bootstrap";

const MAX_NAME_LEN = 100;

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

    if (!values.name.length) errors.name = "Name cannot be blank";
    else if (values.name.length > MAX_NAME_LEN)
      errors.name = "Name is too long";
    else if (!/^[a-zA-Z0-9\._-]+$/.test(values.name))
      errors.name = 'Name can only have alphanumeric characters or "_-."';

    return errors;
  };

  const handleSubmit = async (values, { setErrors, setValues }) => {
    const payload = { ...values };
    const result = await insertUser(accessToken.access_token, payload);
    if (result?.errors && Object.keys(result.errors).length) {
      setErrors(result.errors);
      return;
    }
    setValues({ ...defaultVals });
    setSuccess(true);
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
            <Form onSubmit={handleSubmit}>
              <div className="panel panel-container">
                <div className="row flex-row-space">
                  <div className="col-6">
                    <Form.Group>
                      <Form.Label>Discord ID</Form.Label>
                      <Form.Control
                        name="discord_id"
                        type="text"
                        placeholder="8694...1984"
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
                      <Form.Control.Feedback type="invalid">
                        {errors.discord_id}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>

                  <div className="col-6">
                    <Form.Group>
                      <Form.Label>Username</Form.Label>
                      <Form.Control
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
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-col-space justify-content-center">
                <Button disabled={isSubmitting} type="submit">
                  Insert
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>

      <Toast
        bg="success"
        className="notification"
        show={success}
        onClose={() => setSuccess(false)}
        delay={4000}
        autohide
      >
        <Toast.Body>User inserted!</Toast.Body>
      </Toast>
    </>
  );
}
