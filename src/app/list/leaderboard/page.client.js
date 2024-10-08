"use client";
import { useState } from "react";
import PointCalcFormula from "@/components/layout/maplists/PointCalcFormula";
import Fade from "react-bootstrap/Fade";

export function PointCalcFade() {
  const [show, setShow] = useState(false);
  return (
    <div className="d-flex flex-column align-items-center">
      <button className="btn btn-primary fs-6" onClick={() => setShow(!show)}>
        How are points calculated?
      </button>

      <Fade in={show} mountOnEnter={true} unmountOnExit={true}>
        <div>
          <br />
          <PointCalcFormula />
        </div>
      </Fade>
    </div>
  );
}
