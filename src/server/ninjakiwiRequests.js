const BASE_URL = "https://data.ninjakiwi.com";

export async function getBtd6User(oakOrUid) {
  const response = await fetch(`${BASE_URL}/btd6/users/${oakOrUid}`, {
    next: { revalidate: 3600 * 24 },
  });
  if (response.ok) {
    const result = await response.json();
    return result?.body || null;
  }
  return null;
}

export async function getCustomMap(code) {
  const response = await fetch(`${BASE_URL}/btd6/maps/map/${code}`, {
    next: { revalidate: 3600 * 24 },
  });
  return response.status === 200 ? (await response.json()).body : null;
}
