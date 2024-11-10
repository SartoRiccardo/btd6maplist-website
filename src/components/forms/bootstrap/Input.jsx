import { forwardRef } from "react";

export default forwardRef(function Input(
  {
    name,
    type,
    checked,
    placeholder,
    value,
    onChange,
    onBlur,
    isInvalid,
    isValid,
    disabled,
    autoComplete,
    className,
    rows,
  },
  ref
) {
  const clsTyle = type === "checkbox" ? "form-check-input" : "form-control";
  const props = {
    name,
    type,
    rows,
    placeholder,
    value,
    onChange,
    onBlur,
    disabled,
    autoComplete,
    ref,
    className: `${clsTyle} ${isInvalid ? "is-invalid" : ""} ${
      isValid ? "is-valid" : ""
    } ${className || ""}`,
  };
  if (type === "checkbox") props.checked = checked;

  return type === "textarea" ? <textarea {...props} /> : <input {...props} />;
});
