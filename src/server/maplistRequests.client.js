export async function editProfile(token, userId, profile) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ token, ...profile }),
    }
  );
  return await response.json();
}

export async function editConfig(token, config) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/config`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ token, config }),
  });
  if (response.status === 401)
    return { errors: { "": "Unauthorized", data: {} } };
  return await response.json();
}

export async function addMap(token, map) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/maps`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ token, map }),
  });
  if (response.status === 401)
    return { errors: { "": "Unauthorized", data: {} } };
  return await response.json();
}
