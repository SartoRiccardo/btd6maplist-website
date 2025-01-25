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

  if (role.threshold.length === 0) errors.threshold = "Must have a threshold";
  else if (role.threshold <= 0) errors.threshold = "Threshold must be positive";

  return errors;
}

export function getRepeatedIndexes(list) {
  const sortedList = list
    .map((val, i) => ({ val, i }))
    .toSorted((a, b) => (a.val === b.val ? a.i - b.i : a.val > b.val ? 1 : -1));
  const repeated = [];
  for (let i = 1; i < sortedList.length; i++) {
    if (sortedList[i].val === sortedList[i - 1].val) {
      if (i - 1 === 0) repeated.push(sortedList[i - 1].i);
      repeated.push(sortedList[i].i);
    }
  }
  return repeated;
}
