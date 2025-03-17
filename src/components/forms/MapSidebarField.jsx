"use client";
import { FormikContext } from "@/contexts";
import { useContext } from "react";
import Input from "./bootstrap/Input";

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
  const { handleChange, handleBlur, values, touched, errors, disableInputs } =
    formikProps;

  return (
    <>
      <div className="col-6 col-lg-7">
        <p>{title}</p>
      </div>
      <div className="col-6 col-lg-5" data-cy="form-group">
        {children && !appendChildren ? (
          children
        ) : (
          <div data-cy="form-group">
            <Input
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
              disabled={disabled ? disabled(formikProps) : disableInputs}
              autoComplete="off"
            />
            {invalidFeedback && (
              <div className="invalid-feedback">{errors[name]}</div>
            )}
            {appendChildren && children}
          </div>
        )}
      </div>
    </>
  );
}
