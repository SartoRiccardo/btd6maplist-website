"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const ModalConfirmDeletion = dynamic(
  () => import("../modals/ModalConfirmDeletion"),
  { ssr: false }
);

export default function ConfirmDeleteModal(props) {
  const { show } = props;
  const [mounted, setMounted] = useState(show);

  useEffect(() => {
    if (show) setMounted(true);
  }, [show]);

  return mounted && <ModalConfirmDeletion {...props} />;
}
