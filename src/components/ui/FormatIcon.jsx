"use client";
import stylesComp from "../maps/MaplistCompletions.module.css";
import SelectorButton from "../buttons/SelectorButton";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export default function FormatIcon({ image, name, id, className }) {
  return (
    <OverlayTrigger
      overlay={(props) => (
        <Tooltip {...props} id={`tooltip-format-comp-${id}`}>
          Beaten with {name} rules
        </Tooltip>
      )}
    >
      <div className={`${stylesComp.format_icon} ${className ?? ""}`}>
        <SelectorButton className="me-md-2" active>
          <img src={image} width={35} height={35} />
        </SelectorButton>
      </div>
    </OverlayTrigger>
  );
}
