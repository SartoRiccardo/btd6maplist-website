import { revalidate, cache } from "./cacheOptions";

export async function maplistAuthenticate(token) {
  const response = await fetch(
    `${process.env.API_URL}/auth?discord_token=${token}`,
    { method: "POST", cache: "no-store" }
  );
  if (response.status === 400) return null;
  else if (response.status !== 200)
    return { discord_profile: null, maplist_profile: null };
  return await response.json();
}

export async function getExpertMaplist() {
  const response = await fetch(`${process.env.API_URL}/exmaps`, {
    next: { tags: ["experts"], revalidate },
    cache,
  });
  if (response.status !== 200) return [];
  return await response.json();
}

export async function getTheList(version) {
  const response = await fetch(
    `${process.env.API_URL}/maps?version=${version}`,
    { next: { tags: ["list"], revalidate }, cache }
  );
  if (response.status !== 200) return [];
  return await response.json();
}

export async function getMap(code) {
  const response = await fetch(`${process.env.API_URL}/maps/${code}`, {
    cache,
    next: { revalidate },
  });
  if (response.status !== 200) return null;
  return await response.json();
}

export async function getMapCompletions(code, qparams) {
  const response = await fetch(
    `${process.env.API_URL}/maps/${code}/completions?` +
      new URLSearchParams(qparams).toString(),
    { cache, next: { revalidate } }
  );
  if (response.status !== 200) return [];
  return await response.json();
}

export async function getConfig() {
  const response = await fetch(`${process.env.API_URL}/config`, {
    cache,
    next: { revalidate },
  });
  if (response.status !== 200) return {};
  return await response.json();
}

export async function getUser(id) {
  const response = await fetch(`${process.env.API_URL}/users/${id}`, {
    cache,
    next: { revalidate },
  });
  if (response.status !== 200) return null;
  return await response.json();
}

export async function getUserCompletions(id, qparams) {
  const response = await fetch(
    `${process.env.API_URL}/users/${id}/completions?` +
      new URLSearchParams(qparams).toString(),
    { cache, next: { revalidate } }
  );
  if (!response.ok) return [];
  return await response.json();
}

export async function getListLeaderboard(version, value, page) {
  const response = await fetch(
    `${process.env.API_URL}/maps/leaderboard?version=${version}&value=${value}&page=${page}`,
    { next: { tags: ["leaderboard", "list"], revalidate }, cache }
  );
  if (!response.ok) return { total: 0, pages: 0, entries: [] };
  return await response.json();
}

export async function getCompletion(id) {
  const response = await fetch(`${process.env.API_URL}/completions/${id}`, {
    cache,
    next: { revalidate },
  });
  if (!response.ok) return null;
  return await response.json();
}

export async function getUnapprovedRuns(qparams) {
  const response = await fetch(
    `${process.env.API_URL}/completions/unapproved?` +
      new URLSearchParams(qparams).toString(),
    { next: { tags: ["unapproved"], revalidate }, cache }
  );
  if (response.status !== 200) return null;
  return await response.json();
}
