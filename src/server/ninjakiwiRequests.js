export async function getBtd6User(oakOrUid) {
  const response = await fetch(
    `https://data.ninjakiwi.com/btd6/users/${oakOrUid}`
  );
  return response.status === 200 ? (await response.json()).body : null;
}

export async function getCustomMap(code) {}
