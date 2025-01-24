"use client";
import stylesMedals from "./Medals.module.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const medal_size = 45;
export default function RowMedals({
  black_border,
  no_geraldo,
  current_lcc,
  hideNoGeraldo,
}) {
  return (
    <div className={stylesMedals.medals_container}>
      <OverlayTrigger
        overlay={(props) => (
          <Tooltip {...props}>
            <>
              CHIMPS completion{" "}
              {black_border && (
                <>
                  <br />
                  (Black Border)
                </>
              )}
            </>
          </Tooltip>
        )}
      >
        <img
          src={
            black_border ? "/medals/medal_bb.webp" : "/medals/medal_win.webp"
          }
          width={medal_size}
          height={medal_size}
        />
      </OverlayTrigger>

      {!hideNoGeraldo && (
        <OverlayTrigger
          overlay={(props) => <Tooltip {...props}>No Optimal Hero</Tooltip>}
        >
          <img
            src="/medals/medal_nogerry.webp"
            width={medal_size}
            height={medal_size}
            className={`${!no_geraldo ? stylesMedals.comp_blocked : ""}`}
          />
        </OverlayTrigger>
      )}

      {current_lcc && (
        <OverlayTrigger
          overlay={(props) => <Tooltip {...props}>Current LCC</Tooltip>}
        >
          <img
            src="/medals/medal_lcc.webp"
            width={medal_size}
            height={medal_size}
          />
        </OverlayTrigger>
      )}
    </div>
  );
}
