export function validateUsername(name) {
  const MAX_NAME_LEN = 100;

  if (!name.length) return "Name cannot be blank";
  else if (name.length > MAX_NAME_LEN) return "Name is too long";
  else if (!/^[a-zA-Z0-9 \._-]+$/.test(name))
    return 'Name can only have alphanumeric characters or "_-."';
}

export function validateAchievableRole(role) {
  const MAX_TOOLTIP_LEN = 128;
  const MAX_ROLE_NAME_LEN = 32;

  const errors = {};
  if (role.name.length > MAX_ROLE_NAME_LEN) errors.name = "Name is too long";
  else if (role.name.length === 0) errors.name = "Name cannot be blank";
  if (role.tooltip_description.length > MAX_TOOLTIP_LEN)
    errors.tooltip_description = "Tooltip description is too long";

  return errors;
}
