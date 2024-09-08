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

export async function submitMap(token, payload) {
  const body = new FormData();
  const data = { ...payload };
  delete data.proof_completion;
  body.append("data", JSON.stringify(data));
  body.append("proof_completion", payload.proof_completion);

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
  body.append("proof_completion", payload.proof_completion);

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
  if (!response.ok) return await response.json();
}

export async function editCompletion(token, payload) {
  const body = new FormData();
  const data = { ...payload };
  delete data.id;
  delete data.code;
  delete data.accepted;
  if (payload.lcc?.proof_completion instanceof File) {
    body.append("proof_completion", payload.lcc.proof_completion);
    delete data.lcc.proof_completion;
  }
  body.append("data", JSON.stringify(data));

  const endpoint = payload.code
    ? `/maps/${payload.code}/completions`
    : payload.accept
    ? `/completions/${payload.id}/accept`
    : `/completions/${payload.id}`;
  const method = payload.code ? "POST" : payload.accept ? "POST" : "PUT";
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
    {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body,
    }
  );
  if (response.status === 413)
    return { errors: { "lcc.proof_file": "File is too large!" } };
  if (!response.ok || response.status === 200) return await response.json();
}

export async function deleteCompletion(token, id) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/completions/${id}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (response.ok) return null;
  return await response.json();
}
