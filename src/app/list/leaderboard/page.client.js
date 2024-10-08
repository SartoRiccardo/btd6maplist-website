"use client";
import { useState } from "react";
import PointCalcFormula from "@/components/layout/maplists/PointCalcFormula";
import Fade from "react-bootstrap/Fade";
import Button from "react-bootstrap/Button";

export function PointCalcFade() {
  const [show, setShow] = useState(false);
  return (
    <div className="d-flex flex-column align-items-center">
      <Button className="fs-6" onClick={() => setShow(!show)}>
        How are points calculated?
      </Button>

      <Fade in={show} mountOnEnter={true} unmountOnExit={true}>
        <div>
          <br />
          <PointCalcFormula />
        </div>
      </Fade>
    </div>
  );
}
