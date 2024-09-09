"use client";
import copy from "copy-to-clipboard";
import { useState } from "react";

export default function CopyButton({ content }) {
  const [isCheck, setIsCheck] = useState(false);

  const handleCopy = () => {
    if (isCheck) return;
    setIsCheck(true);
    copy(content);
    setTimeout(() => setIsCheck(false), 3000);
  };

  return (
    <a href="#" onClick={handleCopy}>
      <i className={`bi bi-${isCheck ? "check2" : "copy"}`} />
    </a>
  );
}
