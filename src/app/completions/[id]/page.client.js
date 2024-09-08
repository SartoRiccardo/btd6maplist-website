"use client";
import EditRunForm from "@/components/forms/EditRunForm";
import {
  editCompletion,
  deleteCompletion,
} from "@/server/maplistRequests.client";
import { revalidateCompletion } from "@/server/revalidations";
import { useDiscordToken } from "@/utils/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EditCompletion_C({ completion }) {
  const [accepted, setAccepted] = useState(completion.accepted);
  const router = useRouter();
  const accessToken = useDiscordToken();

  const handleSubmit = async (payload) => {
    const resp = await editCompletion(accessToken.access_token, {
      id: completion.id,
      accept: !completion.accepted,
      ...payload,
    });
    revalidateCompletion(completion.id, completion.map, completion.user_ids);
    setAccepted(true);
    return resp;
  };

  return (
    <EditRunForm
      completion={{ ...completion, accepted }}
      onSubmit={handleSubmit}
      onDelete={async () => {
        const resp = await deleteCompletion(
          accessToken.access_token,
          completion.id
        );
        if (!resp)
          revalidateCompletion(
            completion.id,
            completion.map,
            completion.user_ids
          ).then(() => router.push(`/map/${completion.map}`));
      }}
    />
  );
}
