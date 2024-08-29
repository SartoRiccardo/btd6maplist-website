"use client";
import { FormikContext } from "@/contexts";
import { Fragment, useContext } from "react";
import { Button, Form } from "react-bootstrap";

export default function TwoFieldEntry({
  name,
  fields,
  labels,
  firstProps,
  secondProps,
  omitFirstOptional,
  optional,
}) {
  const formikProps = useContext(FormikContext);
  const {
    handleChange,
    handleBlur,
    values,
    setValues,
    touched,
    errors,
    isSubmitting,
    disableInputs,
  } = formikProps;

  return values[name].map(({ count }, i) => {
    const realField1 = fields[0].replace("[i]", `[${i}]`);
    const realField2 = fields[1].replace("[i]", `[${i}]`);
    const topLevelField1 = fields[0].split("[")[0].split("(")[0];
    const topLevelField2 = fields[1].split("[")[0].split("(")[0];

    // Not flexible, should split by "." walk through the list
    const value1 = values[name][i][fields[0].split(".")[1]];
    const value2 = values[name][i][fields[1].split(".")[1]];

    return (
      <Fragment key={count || -1}>
        <div className="col-12 col-md-5 col-lg-6">
          <Form.Group>
            {labels && labels.length > 0 && (
              <Form.Label>{labels[0]}</Form.Label>
            )}
            <Form.Control
              name={realField1}
              type="text"
              value={value1}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched[topLevelField1] && realField1 in errors}
              isValid={values[realField1]}
              disabled={isSubmitting || disableInputs}
              autoComplete="off"
              {...firstProps}
            />
            <Form.Control.Feedback type="invalid">
              {errors[realField1]}
            </Form.Control.Feedback>
          </Form.Group>
        </div>
        <div className="col-9 col-md-5 col-lg-5">
          {!(omitFirstOptional && i === 0) && (
            <Form.Group>
              {labels && labels.length > 1 && (
                <Form.Label>{labels[1]}</Form.Label>
              )}
              <Form.Control
                name={realField2}
                type="text"
                value={value2}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched[topLevelField2] && realField2 in errors}
                isValid={value2}
                disabled={isSubmitting || disableInputs}
                autoComplete="off"
                {...secondProps}
              />
              <Form.Control.Feedback type="invalid">
                {errors[realField2]}
              </Form.Control.Feedback>
            </Form.Group>
          )}
        </div>

        <div className="col-3 col-md-2 col-lg-1 flex-hcenter">
          {(optional || i > 0) && (
            <div className="d-flex flex-column w-100">
              <Button
                className="map-form-rm-field"
                variant="danger"
                onClick={(_e) =>
                  setValues({
                    ...values,
                    [name]: values[name].filter((_v, idx) => idx !== i),
                  })
                }
              >
                <i className="bi bi-dash" />
              </Button>
            </div>
          )}
        </div>
      </Fragment>
    );
  });
}
