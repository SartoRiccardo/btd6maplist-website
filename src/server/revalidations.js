"use server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidateUser(userId) {
  revalidatePath(`/user/${userId}`);
}

export async function revalidateLeaderboard() {
  revalidatePath("/list/leaderboard");
}

export async function revalidateMap(code) {
  revalidatePath(`/map/${code}`);
  revalidateTag("leaderboard");
  revalidateTag("experts");
  revalidateTag("list");
}

export async function revalidateCompletion(cid, mapCode, userIds) {
  revalidatePath(`/completions/${cid}`);
  for (const { id } of userIds) revalidatePath(`/user/${id}`);
  revalidatePath(`/map/${mapCode}`);
  revalidateTag("leaderboard");
}
