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
}) {
  const props = {
    name,
    rows,
    value,
    onChange,
    onBlur,
    disabled,
    className: `form-select ${isInvalid ? "is-invalid" : ""} ${
      isValid ? "is-valid" : ""
    } ${className || ""}`,
  };

  return <select {...props}>{children}</select>;
}
