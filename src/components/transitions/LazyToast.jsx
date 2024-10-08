"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const Toast = dynamic(() => import("react-bootstrap/Toast"), {
  ssr: false,
});

export default function LazyToast(props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (props.show) setMounted(true);
  }, [props.show]);

  return mounted && <Toast {...props} />;
}
