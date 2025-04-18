"use server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidateUser(userId) {
  revalidateTag(`usr${userId}`);
}

export async function revalidateLeaderboard() {
  revalidatePath("/leaderboard");
}

export async function revalidateMap(code) {
  revalidatePath(`/map/${code}`);
  revalidatePath(`/map/${code}/edit`);
  revalidateTag("leaderboard");
  revalidateTag("maplist");
}

export async function revalidateCompletion(
  mapCode,
  userIds,
  { cid, refreshUnapproved }
) {
  if (cid) revalidatePath(`/completions/${cid}`);
  for (const { id } of userIds) revalidatePath(`/user/${id}`);
  revalidatePath(`/map/${mapCode}`);
  revalidateTag("leaderboard");
  if (refreshUnapproved) revalidateTag("unapproved");
}

export async function revalidateMapSubmissions() {
  revalidateTag("map_submissions");
}

export async function revalidateRoles() {
  revalidateTag("achievement_roles");
}
