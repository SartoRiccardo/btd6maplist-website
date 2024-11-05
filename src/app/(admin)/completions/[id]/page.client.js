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
  const [accepted, setAccepted] = useState(!!completion.accepted_by);
  const router = useRouter();
  const accessToken = useDiscordToken();

  const handleSubmit = async (payload) => {
    delete payload.subm_proof;
    const resp = await editCompletion(accessToken.access_token, {
      id: completion.id,
      accept: !completion.accepted_by,
      ...payload,
    });
    if (resp) return resp;
    revalidateCompletion(completion.map, completion.users, {
      cid: completion.id,
      refreshUnapproved: !completion.accepted_by,
    });
    setAccepted(true);
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
        if (resp) return resp?.errors;

        const navigateTo = completion.accepted_by
          ? `/map/${completion.map}`
          : "/completions/pending";

        await new Promise((resolve) => {
          revalidateCompletion(completion.map, completion.users, {
            cid: completion.id,
            refreshUnapproved: !completion.accepted_by,
          })
            .then(() => router.push(navigateTo))
            .then(resolve);
        });
      }}
    />
  );
}
