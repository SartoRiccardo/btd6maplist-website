"use client";
import {
  MapSubmissionRules,
  RunSubmissionRules,
} from "@/components/layout/maplists/MaplistRules";
import { useVisibleFormats } from "@/utils/hooks";
import { allFormats } from "@/utils/maplistUtils";
import { useState } from "react";

export default function RulePage() {
  const [on, setOn] = useState(1);
  const visibleFormats = useVisibleFormats();

  return (
    <>
      <h1 className="text-center">Submission Rules</h1>

      <p className="muted text-center">
        Rules differ slightly depending on the format
      </p>
      <div className="flex-hcenter flex-col-space" data-cy="btn-rules">
        {allFormats
          .filter(({ value }) => visibleFormats.includes(value))
          .map(({ value, name }) => (
            <button
              className={`btn btn-primary ${on === value ? "active" : ""}`}
              onClick={() => setOn(value)}
            >
              {name}
            </button>
          ))}
      </div>

      <h2 className="text-center mt-5" id="map-rules">
        Map Submission Rules
      </h2>
      <MapSubmissionRules on={on} />

      <h2 className="text-center mt-5" id="run-rules">
        Run Submission Rules
      </h2>
      <RunSubmissionRules on={on} />
    </>
  );
}
