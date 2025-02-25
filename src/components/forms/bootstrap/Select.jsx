export default function Select({
  name,
  value,
  onChange,
  onBlur,
  isInvalid,
  isValid,
  disabled,
  className,
  rows,
  children,
  required,
}) {
  const props = {
    name,
    rows,
    value,
    onChange,
    onBlur,
    disabled,
    required,
    className: `form-select ${isInvalid ? "is-invalid" : ""} ${
      isValid ? "is-valid" : ""
    } ${className || ""}`,
  };

  return <select {...props}>{children}</select>;
}
