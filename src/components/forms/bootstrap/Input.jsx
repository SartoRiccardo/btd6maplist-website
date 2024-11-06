export default function Input({
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
  if (type === "checkbox") props.checked = checked;
  return type === "textarea" ? <textarea {...props} /> : <input {...props} />;
}
