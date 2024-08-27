"use server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidateUser(userId) {
  revalidatePath(`/user/${userId}`);
}

export async function revalidateLeaderboard() {
  revalidatePath("/list/leaderboard");
}

export async function revalidateAddMap(code) {
  revalidatePath(`/map/${code}`);
  revalidateTag("leaderboard");
  revalidateTag("experts");
  revalidateTag("list");
}
