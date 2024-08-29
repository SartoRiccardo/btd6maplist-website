export async function editProfile(token, userId, profile) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(profile),
    }
  );
  return await response.json();
}

export async function editConfig(token, config) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/config`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ config }),
  });
  if (response.status === 401)
    return { errors: { "": "Unauthorized", data: {} } };
  return await response.json();
}

export async function addMap(token, map) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/maps`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(map),
  });
  if (response.status === 401)
    return { errors: { "": "Unauthorized", data: {} } };
  else if (!response.ok) return await response.json();
}

export async function editMap(token, map) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/maps/${map.code}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(map),
    }
  );
  if (response.status === 401)
    return { errors: { "": "Unauthorized", data: {} } };
  else if (!response.ok) return await response.json();
}

export async function deleteMap(token, code) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/maps/${code}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (response.status === 401)
    return { errors: { "": "Unauthorized", data: {} } };
}

export async function getMap(code) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/maps/${code}`
  );
  if (!response.ok) return null;
  return await response.json();
}
