"use client";
import EditRunForm from "@/components/forms/EditRunForm";
import { editCompletion } from "@/server/maplistRequests.client";
import { useState } from "react";

export default function EditCompletion_C({ completion }) {
  const [accepted, setAccepted] = useState(completion.accepted);
  const handleUpdate = async (accessToken, payload) => {
    return await editCompletion(accessToken, { id: completion.id, ...payload });
    console.log("UPDATE IT");
  };

  const handleAccept = async (accessToken, payload) => {
    console.log("ACCEPT IT");
    setAccepted(true);
  };

  return (
    <EditRunForm
      completion={{ ...completion, accepted }}
      onSubmit={completion.accepted ? handleUpdate : handleAccept}
      onDelete={async (accessToken) => {
        console.log("DELETE IT");
      }}
    />
  );
}
