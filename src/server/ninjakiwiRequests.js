const BASE_URL = "https://data.ninjakiwi.com";

export async function getBtd6User(oakOrUid) {
  const response = await fetch(`${BASE_URL}/btd6/users/${oakOrUid}`);
  return response.status === 200 ? (await response.json()).body : null;
}

export async function getCustomMap(code) {
  const response = await fetch(`${BASE_URL}/btd6/maps/map/${code}`);
  return response.status === 200 ? (await response.json()).body : null;
}
