export function validateUsername(name) {
  const MAX_NAME_LEN = 100;

  if (!name.length) return "Name cannot be blank";
  else if (name.length > MAX_NAME_LEN) return "Name is too long";
  else if (!/^[a-zA-Z0-9 \._-]+$/.test(name))
    return 'Name can only have alphanumeric characters or "_-."';
}
