export default function Input({
  name,
  type,
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
}) {
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
    className: `${clsTyle} ${isInvalid ? "is-invalid" : ""} ${
      isValid ? "is-valid" : ""
    } ${className || ""}`,
  };
  return type === "textarea" ? <textarea {...props} /> : <input {...props} />;
}
