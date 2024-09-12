"use client";
import {
  MapSubmissionRules,
  RunSubmissionRules,
} from "@/components/layout/maplists/MaplistRules";
import MustBeInDiscord from "@/components/utils/MustBeInDiscord";
import { useState } from "react";
import { Button } from "react-bootstrap";

export default function RulePage() {
  const [on, setOn] = useState("list");

  return (
    <>
      <h1 className="text-center">Submission Rules</h1>

      <MustBeInDiscord />

      <p className="muted text-center">
        Rules differ slightly depending on the format
      </p>
      <div className="flex-hcenter flex-col-space">
        <Button
          className={on === "list" ? "active" : ""}
          onClick={() => setOn("list")}
        >
          List
        </Button>
        <Button
          className={on === "experts" ? "active" : ""}
          onClick={() => setOn("experts")}
        >
          Experts
        </Button>
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
