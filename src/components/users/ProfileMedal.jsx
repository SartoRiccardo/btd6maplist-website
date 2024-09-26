"use client";
import stylesPrfM from "./ProfileMedal.module.css";
import { btd6Font } from "@/lib/fonts";
import Image from "next/image";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const medalToSrc = {
  wins: "win",
  black_border: "bb",
  no_geraldo: "nogerry",
  lccs: "lcc",
};

const medalToTooltip = {
  wins: "CHIMPS Completions",
  black_border: (
    <>
      CHIMPS Completions
      <br />
      (Black Border)
    </>
  ),
  no_geraldo: "No Optimal Hero",
  lccs: "Least Cash CHIMPS",
};

export default function ProfileMedal({ medal, count }) {
  return (
    <OverlayTrigger
      overlay={(props) => <Tooltip {...props}>{medalToTooltip[medal]}</Tooltip>}
    >
      <div className="p-relative">
        <Image
          src={`/medals/medal_${medalToSrc[medal]}.webp`}
          alt=""
          width={60}
          height={60}
        />
        <p
          className={`${btd6Font.className} font-border fs-4 ${stylesPrfM.medal_count}`}
        >
          {count}
        </p>
      </div>
    </OverlayTrigger>
  );
}
