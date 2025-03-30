"use client";

import { useState } from "react";
import ZoomedImage from "../utils/ZoomedImage";

export default function ZoomableImage(props) {
  const [show, setShow] = useState(false);

  const injectProps = {
    ...props,
    className: `c-zoom-in ${props.className || ""}`,
  };

  return (
    <>
      <img {...injectProps} onClick={() => setShow(true)} />
      <ZoomedImage show={show} onHide={() => setShow(false)} src={props.src} />
    </>
  );
}
