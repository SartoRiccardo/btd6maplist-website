"use client";
import { useState } from "react";
import PointCalcFormula from "@/components/layout/maplists/PointCalcFormula";
import LazyFade from "@/components/transitions/LazyFade";
import PointCalcExperts from "@/components/layout/maplists/PointCalcExperts";

export function PointCalcFade({ format }) {
  const [show, setShow] = useState(false);
  return (
    <div className="d-flex flex-column align-items-center">
      <button className="btn btn-primary fs-6" onClick={() => setShow(!show)}>
        How are points calculated?
      </button>

      <LazyFade in={show} mountOnEnter={true} unmountOnExit={true}>
        <div>
          <br />
          {format === "experts" ? <PointCalcExperts /> : <PointCalcFormula />}
        </div>
      </LazyFade>
    </div>
  );
}
