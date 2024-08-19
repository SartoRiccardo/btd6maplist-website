"use server";
import { revalidatePath } from "next/cache";

export async function revalidateUser(userId) {
  revalidatePath(`/user/${userId}`);
}

export async function revalidateLeaderboard() {
  revalidatePath("/list/leaderboard");
}
