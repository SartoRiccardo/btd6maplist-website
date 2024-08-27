export async function maplistAuthenticate(token) {
  const response = await fetch(
    `${process.env.API_URL}/auth?discord_token=${token}`,
    { method: "POST" }
  );
  if (response.status === 400) return null;
  else if (response.status !== 200)
    return { discord_profile: null, maplist_profile: null };
  return await response.json();
}

export async function getExpertMaplist() {
  const response = await fetch(`${process.env.API_URL}/exmaps`, {
    next: { tags: ["experts"] },
  });
  if (response.status !== 200) return [];
  return await response.json();
}

export async function getTheList(version) {
  const response = await fetch(
    `${process.env.API_URL}/maps?version=${version}`,
    { next: { tags: ["list"] } }
  );
  if (response.status !== 200) return [];
  return await response.json();
}

export async function getMap(code) {
  const response = await fetch(`${process.env.API_URL}/maps/${code}`);
  if (response.status !== 200) return null;
  return await response.json();
}

export async function getMapCompletions(code) {
  const response = await fetch(
    `${process.env.API_URL}/maps/${code}/completions`
  );
  if (response.status !== 200) return [];
  return await response.json();
}

export async function getConfig() {
  const response = await fetch(`${process.env.API_URL}/config`);
  if (response.status !== 200) return {};
  return await response.json();
}

export async function getUser(id) {
  const response = await fetch(`${process.env.API_URL}/users/${id}`);
  if (response.status !== 200) return null;
  return await response.json();
}

export async function getListLeaderboard(version, value) {
  const response = await fetch(
    `${process.env.API_URL}/maps/leaderboard?version=${version}&value=${value}`,
    { next: { tags: ["leaderboard", "list"] } }
  );
  if (response.status !== 200) return [];
  return await response.json();
}
