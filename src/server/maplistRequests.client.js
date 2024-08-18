export async function editProfile(token, userId, profile) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
    { method: "PUT", body: JSON.stringify({ token, ...profile }) }
  );
  return await response.json();
}
