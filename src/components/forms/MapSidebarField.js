"use client";
import { FormikContext } from "@/contexts";
import { useContext } from "react";
import { Form } from "react-bootstrap";

export default function MapSidebarField({
  title,
  name,
  type,
  placeholder,
  invalidFeedback,
  children,
  appendChildren,
  value,
  isValid,
  disabled,
}) {
  const formikProps = useContext(FormikContext);
  const {
    handleChange,
    handleBlur,
    values,
    touched,
    errors,
    isSubmitting,
    disableInputs,
  } = formikProps;

  return (
    <>
      <div className="col-6 col-lg-7">
        <p>{title}</p>
      </div>
      <div className="col-6 col-lg-5">
        {children && !appendChildren ? (
          children
        ) : (
          <Form.Group>
            <Form.Control
              name={name}
              type={type || "text"}
              placeholder={placeholder || ""}
              value={value ? value(formikProps) : values[name]}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched[name] && name in errors}
              isValid={
                isValid
                  ? isValid(formikProps)
                  : !(name in errors) && values[name]
              }
              disabled={
                disabled ? disabled(formikProps) : isSubmitting || disableInputs
              }
              autoComplete="off"
            />
            {invalidFeedback && (
              <Form.Control.Feedback type="invalid">
                {errors[name]}
              </Form.Control.Feedback>
            )}
            {appendChildren && children}
          </Form.Group>
        )}
      </div>
    </>
  );
}
