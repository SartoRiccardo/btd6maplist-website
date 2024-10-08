"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const Modal = dynamic(() => import("react-bootstrap/Modal"), {
  ssr: false,
});

export default function LazyModal(props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (props.show) setMounted(true);
  }, [props.show]);

  return mounted && <Modal {...props} />;
}
