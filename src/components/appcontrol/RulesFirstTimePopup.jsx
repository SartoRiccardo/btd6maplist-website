"use client";
import dynamic from "next/dynamic";
import { selectMaplistProfile } from "@/features/authSlice";
import { useAppSelector } from "@/lib/store";
import { useDiscordToken } from "@/utils/hooks";
import { useEffect, useState } from "react";
const ModalRulesFirstTime = dynamic(
  () => import("../modals/ModalRulesFirstTime"),
  { ssr: false }
);

export default function RulesFirstTimePopup() {
  const [show, setShow] = useState(false);
  const [mountModal, setMountModal] = useState(false);
  const { maplistProfile } = useAppSelector(selectMaplistProfile);
  const token = useDiscordToken();
  const showModal =
    show && maplistProfile && !maplistProfile.has_seen_popup && token;

  useEffect(() => setShow(true), []);
  useEffect(() => {
    if (showModal) setMountModal(true);
  }, [showModal]);

  const handleClose = () => {
    setShow(false);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/read-rules`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
  };

  return (
    mountModal && <ModalRulesFirstTime show={showModal} onHide={handleClose} />
  );
}
