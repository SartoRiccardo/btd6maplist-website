"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const ModalZoomedImage = dynamic(() => import("../modals/ModalZoomedImage"), {
  ssr: false,
});

export default function ZoomedImage(props) {
  const { show } = props;
  const [mounted, setMounted] = useState(show);

  useEffect(() => {
    if (show) setMounted(true);
  }, [show]);

  return mounted && <ModalZoomedImage {...props} />;
}
