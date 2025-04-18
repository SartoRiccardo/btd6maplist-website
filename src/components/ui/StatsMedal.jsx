"use client";
import cssStatsMedal from "./StatsMedal.module.css";
import { getPositionColor } from "@/utils/functions";
import { btd6Font } from "@/lib/fonts";
import Image from "next/image";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export default function StatsMedal({ src, placement, description, score }) {
  return (
    <OverlayTrigger
      overlay={(props) => <Tooltip {...props}>{description}</Tooltip>}
    >
      <div className={`p-relative ${placement ? "" : cssStatsMedal.no_points}`}>
        <Image src={src} alt="" width={49} height={49} />
        <p
          className={`${btd6Font.className} font-border ${cssStatsMedal.score}`}
        >
          {score}
        </p>

        <div
          className={`font-border rounded-3 ${cssStatsMedal.placement}`}
          style={{
            backgroundColor: getPositionColor(placement) || "#7191AD",
            border: placement ? null : "1px solid var(--color-primary)",
          }}
        >
          #{placement || "-"}
        </div>
      </div>
    </OverlayTrigger>
  );
}
