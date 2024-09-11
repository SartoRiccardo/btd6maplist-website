"use client";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import styles from "./userpage.module.css";

export function UserRole({ name, color, borderColor, description }) {
  return (
    <OverlayTrigger
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

export function WebsiteCreatorRole() {
  return (
    <OverlayTrigger
      overlay={(props) => (
        <Tooltip {...props} id="usrrole-website-creator">
          Coded this website!
        </Tooltip>
      )}
    >
      <div className={`font-border ${styles.rainbow}`}>
        <a href="https://github.com/SartoRiccardo/" target="_blank">
          Website Creator <i className="bi bi-box-arrow-up-right ms-1" />
        </a>
      </div>
    </OverlayTrigger>
  );
}
