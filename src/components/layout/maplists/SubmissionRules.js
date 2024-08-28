"use client";
import { useState } from "react";
import { Button, Collapse, Fade } from "react-bootstrap";
import { MapSubmissionRules, RunSubmissionRules } from "./MaplistRules";

export default function SubmissionRules({ on }) {
  const [openRules, setOpenRules] = useState(-1);

  return (
    <div className="mb-4">
      <div className="flex-hcenter flex-col-space">
        <Button
          className={`fs-6 ${openRules === 0 ? "active" : ""}`}
          onClick={(_e) => setOpenRules(openRules !== 0 ? 0 : -1)}
        >
          Map Submission Rules
        </Button>
        <Button
          className={`fs-6 ${openRules === 1 ? "active" : ""}`}
          onClick={(_e) => setOpenRules(openRules !== 1 ? 1 : -1)}
        >
          Run Submission Rules
        </Button>
      </div>

      <Fade in={openRules === 0} mountOnEnter={true} unmountOnExit={true}>
        <div>
          <br />
          <MapSubmissionRules on={on} />
        </div>
      </Fade>
      <Fade in={openRules === 1} mountOnEnter={true} unmountOnExit={true}>
        <div>
          <br />
          <RunSubmissionRules on={on} />
        </div>
      </Fade>
    </div>
  );
}
