"use client";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export function UserRole({ name, color, borderColor, description }) {
  return (
    <OverlayTrigger
      key={name}
      overlay={(props) => (
        <Tooltip {...props} id={`usrrole-${name.replace(" ", "-")}`}>
          {description}
        </Tooltip>
      )}
    >
      <div
        style={{ backgroundColor: color, borderColor }}
        className="font-border"
      >
        {name}
      </div>
    </OverlayTrigger>
  );
}
