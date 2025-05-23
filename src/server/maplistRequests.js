import { allFormats } from "@/utils/maplistUtils";
import { revalidate, cache } from "./cacheOptions";

export async function maplistAuthenticate(token) {
  const response = await fetch(`${process.env.API_URL}/auth`, {
    method: "POST",
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return null;
  return await response.json();
}

export async function getMaplist({ format = 1, filter = undefined } = {}) {
  const searchParams = { format };
  if (filter !== undefined) searchParams.filter = filter;

  const response = await fetch(
    `${process.env.API_URL}/maps?${new URLSearchParams(
      searchParams
    ).toString()}`,
    {
      next: { tags: ["maplist"], revalidate },
      cache,
    }
  );
  if (response.status !== 200) return [];
  return await response.json();
}

export async function getLegacyList() {
  const response = await fetch(`${process.env.API_URL}/maps/legacy`, {
    next: { tags: ["maplist"], revalidate },
    cache,
  });
  if (!response.ok) return [];
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

export async function getMapCompletions(
  code,
  { page = 1, formats = [1, 51] } = {}
) {
  const response = await fetch(
    `${process.env.API_URL}/maps/${code}/completions?` +
      new URLSearchParams({ page, formats: formats.join(",") }).toString(),
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

export async function getMaplistRoles() {
  const response = await fetch(`${process.env.API_URL}/roles`, {
    cache,
    next: { revalidate },
  });
  if (response.status !== 200) return [];
  return await response.json();
}

export async function getUser(id, { minimal = false } = {}) {
  minimal = minimal ?? false;

  const response = await fetch(
    `${process.env.API_URL}/users/${id}?minimal=${minimal}`,
    {
      cache,
      next: { revalidate, tags: [`usr${id}`] },
    }
  );
  if (response.status !== 200) return null;
  return await response.json();
}

export async function getUserCompletions(id, qparams) {
  const response = await fetch(
    `${process.env.API_URL}/users/${id}/completions?` +
      new URLSearchParams(qparams).toString(),
    { cache, next: { revalidate, tags: [`usr${id}`] } }
  );
  if (!response.ok) return [];
  return await response.json();
}

export async function getListLeaderboard(format, value, page) {
  if (value === "no_optimal_hero") value = "no_geraldo";
  if (!allFormats.map(({ value }) => value).includes(format)) {
    format = allFormats.find(({ query }) => query === format).value;
  }

  const response = await fetch(
    `${process.env.API_URL}/maps/leaderboard?format=${format}&value=${value}&page=${page}`,
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

export async function getRecentCompletions(qparams) {
  const response = await fetch(
    `${process.env.API_URL}/completions/recent?` +
      new URLSearchParams(qparams).toString(),
    { next: { tags: ["completions"], revalidate }, cache }
  );
  if (response.status !== 200) return null;
  return await response.json();
}

export async function getMapSubmissions(pending, page) {
  const response = await fetch(
    `${process.env.API_URL}/maps/submit?pending=${pending}&page=${page}`,
    { next: { tags: ["map_submissions"], revalidate }, cache }
  );
  if (!response.ok) return { total: 0, pages: 0, entries: [] };
  return await response.json();
}

export async function getAchievementRoles() {
  const response = await fetch(`${process.env.API_URL}/roles/achievement`, {
    next: { tags: ["achievement_roles"], revalidate },
    cache,
  });
  return await response.json();
}

export async function getFormats() {
  const response = await fetch(`${process.env.API_URL}/formats`, {
    next: { tags: ["formats"], revalidate },
    cache,
  });
  return await response.json();
}

export async function getVisibleFormats() {
  return (await getFormats())
    .filter(({ hidden }) => !hidden)
    .map(({ id }) => id);
}
