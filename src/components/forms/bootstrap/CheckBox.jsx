import Input from "./Input";

export default function CheckBox({
  name,
  value,
  onChange,
  onBlur,
  isInvalid,
  isValid,
  disabled,
  className,
  label,
}) {
  const props = {
    name,
    value,
    onChange,
    onBlur,
    isInvalid,
    isValid,
    disabled,
  };
  return (
    <div className={`form-check ${className || ""}`}>
      <Input type="checkbox" {...props} />
      <label className="form-check-label">{label}</label>
    </div>
  );
}
