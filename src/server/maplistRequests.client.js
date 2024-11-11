import { cache, revalidate } from "./cacheOptions";

const SRV_ERROR_MESSAGE =
  "Something went wrong on the server - please take a screenshot of the form and report it so I can fix it 🥺";

export async function editProfile(token, profile) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/@me`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(profile),
      }
    );
    if (response.headers.get("Content-Type")?.includes("application/json"))
      return await response.json();
  } catch (exc) {
    return { errors: { "": SRV_ERROR_MESSAGE }, data: {} };
  }
}

export async function editConfig(token, config) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/config`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ config }),
    });
    if (response.headers.get("Content-Type")?.includes("application/json"))
      return await response.json();
  } catch (exc) {
    return { errors: { "": SRV_ERROR_MESSAGE }, data: {} };
  }
}

export async function addMap(token, map) {
  const body = new FormData();
  if (map.r6_start instanceof File) {
    body.append("r6_start", map.r6_start);
    map.r6_start = null;
  }
  if (map.map_preview_url instanceof File) {
    body.append("map_preview_url", map.map_preview_url);
    map.map_preview_url = null;
  }
  body.append("data", JSON.stringify(map));

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/maps`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body,
    });
    if (response.headers.get("Content-Type")?.includes("application/json"))
      return await response.json();
  } catch (exc) {
    return { errors: { "": SRV_ERROR_MESSAGE }, data: {} };
  }
}

export async function editMap(token, map) {
  const body = new FormData();
  if (map.r6_start instanceof File) {
    body.append("r6_start", map.r6_start);
    map.r6_start = null;
  }
  if (map.map_preview_url instanceof File) {
    body.append("map_preview_url", map.map_preview_url);
    map.map_preview_url = null;
  }
  body.append("data", JSON.stringify(map));

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/maps/${map.code}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body,
      }
    );
    if (response.headers.get("Content-Type")?.includes("application/json"))
      return await response.json();
  } catch (exc) {
    return { errors: { "": SRV_ERROR_MESSAGE }, data: {} };
  }
}

export async function deleteMap(token, code) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/maps/${code}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.headers.get("Content-Type")?.includes("application/json"))
      return await response.json();
  } catch (exc) {
    return { errors: { "": SRV_ERROR_MESSAGE }, data: {} };
  }
}

export async function getMap(code) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/maps/${code}`
  );
  if (!response.ok) return null;
  return await response.json();
}

export async function submitMap(token, payload) {
  const body = new FormData();
  const data = { ...payload };
  delete data.proof_completion;
  body.append("data", JSON.stringify(data));
  body.append("proof_completion", payload.proof_completion);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/maps/submit`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body,
      }
    );
    if (response.status === 413)
      return { errors: { proof_completion: "File is too large!" } };
    if (!response.ok) return await response.json();
  } catch (exc) {
    return { errors: { "": SRV_ERROR_MESSAGE }, data: {} };
  }
}

export async function getOwnMapCompletions(token, code) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/maps/${code}/completions/@me`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!response.ok) return null;
  return await response.json();
}

export async function submitRun(token, payload) {
  const body = new FormData();
  const data = { ...payload };
  delete data.proof_completion;
  delete data.code;
  body.append("data", JSON.stringify(data));
  for (let i = 0; i < payload.proof_completion.length; i++)
    body.append(`proof_completion`, payload.proof_completion[i]);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/maps/${payload.code}/completions/submit`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body,
      }
    );
    if (response.status === 413)
      return { errors: { proof_completion: "File is too large!" } };
    if (response.headers.get("Content-Type")?.includes("application/json"))
      return await response.json();
  } catch (exc) {
    return { errors: { "": SRV_ERROR_MESSAGE }, data: {} };
  }
}

export async function editCompletion(token, payload) {
  const body = new FormData();
  const data = { ...payload };
  delete data.id;
  delete data.code;
  delete data.accepted_by;
  if (payload?.subm_proof) {
    body.append("submission_proof", payload.subm_proof);
    delete data.subm_proof;
  }
  body.append("data", JSON.stringify(data));

  const endpoint = payload.code
    ? `/maps/${payload.code}/completions`
    : payload.accept
    ? `/completions/${payload.id}/accept`
    : `/completions/${payload.id}`;
  const method = payload.code ? "POST" : "PUT";

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body,
      }
    );
    if (response.headers.get("Content-Type")?.includes("application/json"))
      return await response.json();
    if (response.status === 413)
      return { errors: { "lcc.proof_file": "File is too large!" } };
  } catch (exc) {
    return { errors: { "": SRV_ERROR_MESSAGE }, data: {} };
  }
}

export async function transferCompletions(token, fromCode, toCode) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/maps/${fromCode}/completions/transfer`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code: toCode }),
      }
    );
    if (response.headers.get("Content-Type")?.includes("application/json"))
      return await response.json();
  } catch (exc) {
    return { errors: { "": SRV_ERROR_MESSAGE }, data: {} };
  }
}

export async function deleteCompletion(token, id) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/completions/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.headers.get("Content-Type")?.includes("application/json"))
      return await response.json();
  } catch (exc) {
    return { errors: { "": SRV_ERROR_MESSAGE }, data: {} };
  }
}

export async function insertUser(token, payload) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    if (response.headers.get("Content-Type")?.includes("application/json"))
      return await response.json();
  } catch (exc) {
    return { errors: { "": SRV_ERROR_MESSAGE }, data: {} };
  }
}

export async function rejectMapSubmission(token, code) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/maps/submit/${code}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.headers.get("Content-Type")?.includes("application/json"))
      return await response.json();
  } catch (exc) {
    return { errors: { "": SRV_ERROR_MESSAGE }, data: {} };
  }
}

export async function search(query, type, limit, options = null) {
  const baseUrl = options?.server
    ? process.env.API_URL
    : process.env.NEXT_PUBLIC_API_URL;
  const fetchOpts = options?.server
    ? {
        next: { tags: ["list"], revalidate },
        cache,
      }
    : {};

  const urlParams = new URLSearchParams({ q: query, type, limit });
  const response = await fetch(
    `${baseUrl}/search?${urlParams.toString()}`,
    fetchOpts
  );
  return await response.json();
}

export async function addRoleToUser(token, userId, roleId) {
  return await editUserRole(token, userId, roleId, "POST");
}

export async function removeRoleFromUser(token, userId, roleId) {
  return await editUserRole(token, userId, roleId, "DELETE");
}

async function editUserRole(token, userId, roleId, action) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/roles`,
      {
        method: "PATCH",
        body: JSON.stringify({ roles: [{ id: roleId, action }] }),
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.headers.get("Content-Type")?.includes("application/json"))
      return await response.json();
  } catch (exc) {
    return { errors: { "": SRV_ERROR_MESSAGE }, data: {} };
  }
}
