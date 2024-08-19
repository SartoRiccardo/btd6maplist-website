export async function editProfile(token, userId, profile) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
    { method: "PUT", body: JSON.stringify({ token, ...profile }) }
  );
  return await response.json();
}

export async function editConfig(token, config) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/config`, {
    method: "PUT",
    body: JSON.stringify({ token, config }),
  });
  if (response.status === 401) return null;
  return await response.json();
}
