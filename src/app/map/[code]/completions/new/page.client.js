"use client";
import EditRunForm from "@/components/forms/EditRunForm";
import { editCompletion } from "@/server/maplistRequests.client";
import { revalidateCompletion } from "@/server/revalidations";
import { useDiscordToken } from "@/utils/hooks";
import { useRouter } from "next/navigation";

export default function EditCompletion_C({ code }) {
  const router = useRouter();
  const accessToken = useDiscordToken();

  const handleSubmit = async (payload) => {
    const resp = await editCompletion(accessToken.access_token, {
      code,
      ...payload,
    });
    if ("errors" in resp) return resp;

    return new Promise((resolve) => {
      revalidateCompletion(null, code, resp).then(() => {
        router.push(`/map/${code}`);
        resolve();
      });
    });
  };

  return <EditRunForm onSubmit={handleSubmit} />;
}
