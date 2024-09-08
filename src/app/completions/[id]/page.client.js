"use client";
import EditRunForm from "@/components/forms/EditRunForm";
import { editCompletion } from "@/server/maplistRequests.client";
import { revalidateCompletion } from "@/server/revalidations";
import { useState } from "react";

export default function EditCompletion_C({ completion }) {
  const [accepted, setAccepted] = useState(completion.accepted);

  const handleSubmit = async (accessToken, payload) => {
    const resp = await editCompletion(accessToken, {
      id: completion.id,
      accept: !completion.accepted,
      ...payload,
    });
    revalidateCompletion(completion.id, completion.map);
    setAccepted(true);
    return resp;
  };

  return (
    <EditRunForm
      completion={{ ...completion, accepted }}
      onSubmit={handleSubmit}
      onDelete={async (accessToken) => {
        console.log("DELETE IT");
      }}
    />
  );
}
