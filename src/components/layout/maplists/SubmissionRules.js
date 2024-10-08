"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { MapSubmissionRules, RunSubmissionRules } from "./MaplistRules";
const LazyFade = dynamic(() => import("@/components/transitions/LazyFade"), {
  ssr: false,
});

export default function SubmissionRules({ on }) {
  const [openRules, setOpenRules] = useState(-1);

  return (
    <div className="mb-4">
      <div className="flex-hcenter flex-col-space">
        <button
          className={`btn btn-primary fs-6 ${openRules === 0 ? "active" : ""}`}
          onClick={(_e) => setOpenRules(openRules !== 0 ? 0 : -1)}
        >
          Map Submission Rules
        </button>
        <button
          className={`btn btn-primary fs-6 ${openRules === 1 ? "active" : ""}`}
          onClick={(_e) => setOpenRules(openRules !== 1 ? 1 : -1)}
        >
          Run Submission Rules
        </button>
      </div>

      <LazyFade in={openRules === 0} mountOnEnter={true} unmountOnExit={true}>
        <div>
          <br />
          <MapSubmissionRules on={on} />
        </div>
      </LazyFade>
      <LazyFade in={openRules === 1} mountOnEnter={true} unmountOnExit={true}>
        <div>
          <br />
          <RunSubmissionRules on={on} />
        </div>
      </LazyFade>
    </div>
  );
}
