"use client";
import { useState } from "react";
import ZoomedImage from "../utils/ZoomedImage";

export default function BtnShowCompletion({ src }) {
  const [show, setShow] = useState(false);

  return (
    <>
      <p className="text-center mb-0">
        <span
          className="completion-link align-self-center no-underline"
          onClick={() => setShow(true)}
        >
          <i className="bi bi-search" />
        </span>
      </p>

      <ZoomedImage show={show} onHide={() => setShow(false)} src={src} />
    </>
  );
}
