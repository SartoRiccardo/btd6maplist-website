"use client";
import { FormikContext } from "@/contexts";
import { Formik } from "formik";
import { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import AddableField from "./AddableField";

export default function EditRunForm({ completion, onSubmit }) {
  onSubmit = onSubmit || (async () => {});

  const [showErrorCount, setShowErrorCount] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = (values) => {
    const errors = {};

    for (let i = 0; i < values.user_ids.length; i++) {
      if (!values.user_ids[i].uid.length)
        errors[`user_ids[${i}]`] = "This cannot be blank";
    }

    return errors;
  };

  const handleSubmit = async (values, { setErrors }) => {
    const payload = {
      ...values,
    };
    console.log(payload);

    // const result = await onSubmit(accessToken.access_token, payload);
    // if (result && Object.keys(result.errors).length) {
    //   setErrors(result.errors);
    //   return;
    // }
    // setSuccess(true);
  };

  return (
    <Formik
      validate={validate}
      onSubmit={handleSubmit}
      initialValues={{
        black_border: completion.black_border,
        no_geraldo: completion.no_geraldo,
        user_ids: completion.user_ids.map(({ name }, i) => ({
          uid: name,
          count: -(i + 1),
        })),
      }}
    >
      {(formikProps) => {
        const { handleSubmit, isSubmitting } = formikProps;
        const disableInputs = isSubmitting;

        return (
          <FormikContext.Provider
            value={{ ...formikProps, disableInputs }}
            key={0}
          >
            <Form
              onSubmit={(evt) => {
                setShowErrorCount(true);
                handleSubmit(evt);
              }}
            >
              <div className="row">
                <RunProperties />
              </div>

              <Button type="submit">Submit</Button>
            </Form>
          </FormikContext.Provider>
        );
      }}
    </Formik>
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

        <Form.Check
          type="checkbox"
          className="medal-check"
          name="black_border"
          onChange={handleChange}
          value={values.black_border}
          disabled={disableInputs}
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
          disabled={disableInputs}
          label={
            <span>
              <img src="/medal_nogerry.png" className="inline-medal" />
              &nbsp; No Optimal Hero
            </span>
          }
        />

        <h3 className="text-center">Player(s)</h3>
        <AddableField name="user_ids" defaultValue={{ uid: "" }}>
          {values.user_ids.map(({ count, uid }, i) => (
            <div
              key={count}
              className="flex-hcenter flex-col-space px-0 px-md-5 mb-2"
            >
              <Form.Group className="w-100">
                <Form.Control
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
                <Form.Control.Feedback type="invalid">
                  {errors[`user_ids[${i}]`]}
                </Form.Control.Feedback>
              </Form.Group>
              {values.user_ids.length > 1 && (
                <div>
                  <Button
                    variant="danger"
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
                  </Button>
                </div>
              )}
            </div>
          ))}
        </AddableField>
      </div>
    </div>
  );
}

function LCCProperites() {}
