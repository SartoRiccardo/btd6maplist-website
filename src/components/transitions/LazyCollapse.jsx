"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const Collapse = dynamic(() => import("react-bootstrap/Collapse"), {
  ssr: false,
});

export default function LazyCollapse(props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (props.in) setMounted(true);
  }, [props.in]);

  return mounted && <Collapse {...props} />;
}
