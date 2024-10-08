"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const Fade = dynamic(() => import("react-bootstrap/Fade"), {
  ssr: false,
});

export default function LazyFade(props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (props.in) setMounted(true);
  }, [props.in]);

  return mounted && <Fade {...props} />;
}
