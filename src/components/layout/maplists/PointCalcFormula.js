"use client";
import cssMedals from "@/components/maps/Medals.module.css";
import cssFormula from "./Formula.module.css";
import { useMaplistConfig } from "@/utils/hooks";

export default function PointCalcFormula() {
  const maplistCfg = useMaplistConfig();

  return (
    <div className="panel pt-3 px-3">
      <h2 className="text-center">Points Assigned per Run</h2>
      <p>
        Once you beat a map, you will be assigned its points. If your run
        fullfills certain requirements, your run may be worth more:
      </p>
      <ul>
        <li>
          <img
            src="/medals/medal_nogerry.webp"
            className={`${cssMedals.inline_medal} me-1`}
          />{" "}
          Maps beat without using its Optimal Hero are worth{" "}
          <b>{maplistCfg.points_multi_gerry}x points</b>
        </li>
        <li>
          <img
            src="/medals/medal_bb.webp"
            className={`${cssMedals.inline_medal} me-1`}
          />{" "}
          Maps beat without ever loading a save (a <i>Black Border</i> run) are
          worth <b>{maplistCfg.points_multi_bb}x points</b>
        </li>
        <li>
          <img
            src="/medals/medal_lcc.webp"
            className={`${cssMedals.inline_medal} me-1`}
          />{" "}
          Holding the current LCC on a map gives you{" "}
          <b>+{maplistCfg.points_extra_lcc} points</b>
          <ul>
            <li>
              This is added after all previous multipliers have been applied, if
              any
            </li>
          </ul>
        </li>
      </ul>

      <p>
        If you have multiple runs on a map, your points will be calculated
        taking them all into account. For example, if you had these 3 runs:
      </p>
      <ul>
        <li>A normal run, with no modifiers</li>
        <li>A black border run</li>
        <li>The map's current LCC, with no other modifiers</li>
      </ul>
      <p>
        You would be given the map's points x{maplistCfg.points_multi_bb}{" "}
        (because of the Black Border) +{maplistCfg.points_extra_lcc} (because of
        the LCC).
      </p>

      <h2 className="text-center">Map Point Formula</h2>
      <Formula className={cssFormula.formula} />
      <p>
        This is the formula used to calculate the points for a map in the
        position <code>x</code>. The other parameters are:
      </p>
      <ul>
        <li>
          <code>least</code>: The amount of points the last map is worth{" "}
          <i>
            (currently <b>{maplistCfg.points_bottom_map}</b>)
          </i>
        </li>
        <li>
          <code>most</code>: The amount of points the #1 map is worth{" "}
          <i>
            (currently <b>{maplistCfg.points_top_map}</b>)
          </i>
        </li>
        <li>
          <code>maps</code>: The amount of maps on the list{" "}
          <i>
            (currently <b>{maplistCfg.map_count}</b>)
          </i>
        </li>
        <li>
          <code>steep</code>: A parameter to control how steep the curve is.{" "}
          <i>
            (currently <b>{maplistCfg.formula_slope}</b>)
          </i>
        </li>
      </ul>
    </div>
  );
}

const Formula = (props) => (
  <svg
    height="52.1531pt"
    viewBox="213.256 117.968 270.039 52.1531"
    width="270.039pt"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <defs>
      <path
        d="M3.28767 -5.10486C3.29963 -5.27223 3.29963 -5.55915 2.98879 -5.55915C2.79751 -5.55915 2.64209 -5.40374 2.67796 -5.24832V-5.0929L2.84533 -3.23985L1.31507 -4.35168C1.20747 -4.41146 1.18356 -4.43537 1.09988 -4.43537C0.932503 -4.43537 0.777086 -4.268 0.777086 -4.10062C0.777086 -3.90934 0.896638 -3.86152 1.01619 -3.80174L2.71382 -2.98879L1.06401 -2.1878C0.872727 -2.09215 0.777086 -2.04433 0.777086 -1.86501S0.932503 -1.53026 1.09988 -1.53026C1.18356 -1.53026 1.20747 -1.53026 1.50635 -1.75741L2.84533 -2.72578L2.666 -0.71731C2.666 -0.466252 2.8812 -0.406476 2.97684 -0.406476C3.1203 -0.406476 3.29963 -0.490162 3.29963 -0.71731L3.1203 -2.72578L4.65056 -1.61395C4.75816 -1.55417 4.78207 -1.53026 4.86575 -1.53026C5.03313 -1.53026 5.18854 -1.69763 5.18854 -1.86501C5.18854 -2.04433 5.08095 -2.10411 4.93748 -2.17584C4.22017 -2.5345 4.19626 -2.5345 3.25181 -2.97684L4.90162 -3.77783C5.0929 -3.87347 5.18854 -3.9213 5.18854 -4.10062S5.03313 -4.43537 4.86575 -4.43537C4.78207 -4.43537 4.75816 -4.43537 4.45928 -4.20822L3.1203 -3.23985L3.28767 -5.10486Z"
        id="g2-3"
      />
      <path
        d="M8.36862 28.0827C8.36862 28.0349 8.34471 28.011 8.3208 27.9751C7.87846 27.5328 7.07746 26.7318 6.27646 25.4406C4.35168 22.3562 3.47895 18.4707 3.47895 13.868C3.47895 10.6521 3.90934 6.50361 5.88194 2.94097C6.8264 1.24334 7.80672 0.263014 8.33275 -0.263014C8.36862 -0.298879 8.36862 -0.32279 8.36862 -0.358655C8.36862 -0.478207 8.28493 -0.478207 8.11756 -0.478207S7.92628 -0.478207 7.74695 -0.298879C3.74197 3.34745 2.48667 8.82291 2.48667 13.856C2.48667 18.5544 3.56264 23.2887 6.59925 26.8633C6.83836 27.1382 7.29265 27.6284 7.78281 28.0588C7.92628 28.2022 7.95019 28.2022 8.11756 28.2022S8.36862 28.2022 8.36862 28.0827Z"
        id="g0-18"
      />
      <path
        d="M6.30037 13.868C6.30037 9.16961 5.22441 4.43537 2.1878 0.860772C1.94869 0.585803 1.4944 0.0956413 1.00423 -0.334745C0.860772 -0.478207 0.836862 -0.478207 0.669489 -0.478207C0.526027 -0.478207 0.418431 -0.478207 0.418431 -0.358655C0.418431 -0.310834 0.466252 -0.263014 0.490162 -0.239103C0.908593 0.191283 1.70959 0.992279 2.51059 2.28344C4.43537 5.36787 5.30809 9.2533 5.30809 13.856C5.30809 17.072 4.87771 21.2204 2.90511 24.7831C1.96065 26.4807 0.968369 27.473 0.466252 27.9751C0.442341 28.011 0.418431 28.0468 0.418431 28.0827C0.418431 28.2022 0.526027 28.2022 0.669489 28.2022C0.836862 28.2022 0.860772 28.2022 1.0401 28.0229C5.04508 24.3766 6.30037 18.9011 6.30037 13.868Z"
        id="g0-19"
      />
      <path
        d="M3.10237 -1.9188C3.13225 -2.05629 3.19203 -2.28344 3.19203 -2.32528C3.19203 -2.45679 3.09041 -2.52254 2.98281 -2.52254C2.81544 -2.52254 2.71382 -2.36712 2.69589 -2.27746C2.6122 -2.41494 2.40897 -2.63611 2.03836 -2.63611C1.27323 -2.63611 0.448319 -1.83512 0.448319 -0.956413C0.448319 -0.310834 0.902615 0.0597758 1.41071 0.0597758C1.81121 0.0597758 2.15193 -0.215193 2.30137 -0.364633C2.41494 0.0119552 2.81544 0.0597758 2.94695 0.0597758C3.16214 0.0597758 3.31756 -0.0597758 3.43113 -0.245081C3.58057 -0.484184 3.66426 -0.830884 3.66426 -0.860772C3.66426 -0.872727 3.65828 -0.944458 3.55068 -0.944458C3.46102 -0.944458 3.44907 -0.902615 3.42516 -0.806974C3.32951 -0.442341 3.20399 -0.137484 2.97086 -0.137484C2.76762 -0.137484 2.74969 -0.352677 2.74969 -0.442341C2.74969 -0.52005 2.80946 -0.759153 2.85131 -0.91457L3.10237 -1.9188ZM2.32528 -0.783064C2.29539 -0.675467 2.29539 -0.663512 2.21171 -0.573848C1.88294 -0.203238 1.57808 -0.137484 1.42864 -0.137484C1.18954 -0.137484 0.956413 -0.298879 0.956413 -0.723288C0.956413 -0.968369 1.08194 -1.55417 1.27323 -1.89489C1.45255 -2.21768 1.75741 -2.43885 2.04433 -2.43885C2.49265 -2.43885 2.60623 -1.96663 2.60623 -1.92478L2.58829 -1.8411L2.32528 -0.783064Z"
        id="g3-97"
      />
      <path
        d="M1.32105 -1.34496C1.71557 -1.34496 2.16986 -1.37484 2.4807 -1.47646C3.00075 -1.64981 3.02466 -2.01445 3.02466 -2.10411C3.02466 -2.39701 2.73773 -2.63611 2.22964 -2.63611C1.4944 -2.63611 0.478207 -2.11009 0.478207 -1.08792C0.478207 -0.454296 0.89066 0.0597758 1.63786 0.0597758C2.74969 0.0597758 3.18605 -0.532005 3.18605 -0.603736C3.18605 -0.657534 3.1203 -0.723288 3.07248 -0.723288C3.04259 -0.723288 3.03661 -0.71731 2.94695 -0.627646C2.58829 -0.221171 1.97858 -0.137484 1.64981 -0.137484C1.16563 -0.137484 0.992279 -0.484184 0.992279 -0.86675C0.992279 -0.91457 0.998257 -1.11183 1.05803 -1.34496H1.32105ZM1.11183 -1.54222C1.30909 -2.24757 1.89489 -2.43885 2.22964 -2.43885C2.51059 -2.43885 2.74969 -2.31333 2.74969 -2.09813C2.74969 -1.54222 1.75143 -1.54222 1.11183 -1.54222Z"
        id="g3-101"
      />
      <path
        d="M2.8274 -0.514072C2.79751 -0.388543 2.74371 -0.179328 2.74371 -0.137484C2.74371 -0.00597758 2.84533 0.0597758 2.95293 0.0597758S3.16214 -0.0119552 3.20996 -0.101619C3.22192 -0.137484 3.27572 -0.3467 3.3056 -0.466252L3.43711 -1.00423C3.47895 -1.15965 3.50286 -1.26725 3.53873 -1.40473C3.59253 -1.60797 3.80174 -1.92478 4.02291 -2.14595C4.14247 -2.25953 4.3995 -2.43885 4.72229 -2.43885C5.10486 -2.43885 5.10486 -2.134 5.10486 -2.02042C5.10486 -1.66775 4.84782 -1.02814 4.74022 -0.759153C4.70436 -0.657534 4.66252 -0.561893 4.66252 -0.460274C4.66252 -0.155417 4.93748 0.0597758 5.26625 0.0597758C5.86999 0.0597758 6.16887 -0.729265 6.16887 -0.860772C6.16887 -0.872727 6.16289 -0.944458 6.05529 -0.944458C5.97161 -0.944458 5.96563 -0.91457 5.92976 -0.800996C5.82217 -0.454296 5.56513 -0.137484 5.29016 -0.137484C5.20648 -0.137484 5.12279 -0.17335 5.12279 -0.352677C5.12279 -0.472229 5.16463 -0.579826 5.21843 -0.705355C5.28418 -0.872727 5.57709 -1.59601 5.57709 -1.94271C5.57709 -2.43288 5.20648 -2.63611 4.75218 -2.63611C4.42341 -2.63611 4.02889 -2.51656 3.64035 -2.00847C3.60448 -2.45081 3.25181 -2.63611 2.81544 -2.63611C2.51656 -2.63611 2.134 -2.54047 1.75143 -2.06824C1.72154 -2.52254 1.30311 -2.63611 1.07597 -2.63611S0.6934 -2.49863 0.585803 -2.30735C0.430386 -2.05629 0.364633 -1.73948 0.364633 -1.72154C0.364633 -1.65579 0.418431 -1.63188 0.472229 -1.63188C0.56787 -1.63188 0.573848 -1.67372 0.603736 -1.76936C0.723288 -2.24159 0.86675 -2.43885 1.05803 -2.43885C1.26127 -2.43885 1.27323 -2.22964 1.27323 -2.134S1.21345 -1.79925 1.17161 -1.63188C1.12976 -1.47049 1.06999 -1.2254 1.0401 -1.0939C0.998257 -0.944458 0.962391 -0.789041 0.920548 -0.639601C0.878705 -0.472229 0.806974 -0.17335 0.806974 -0.137484C0.806974 -0.00597758 0.908593 0.0597758 1.01619 0.0597758S1.2254 -0.0119552 1.27323 -0.101619C1.28518 -0.137484 1.33898 -0.3467 1.36887 -0.466252L1.50037 -1.00423C1.54222 -1.15965 1.56613 -1.26725 1.60199 -1.40473C1.65579 -1.60797 1.86501 -1.92478 2.08618 -2.14595C2.20573 -2.25953 2.46276 -2.43885 2.78555 -2.43885C3.16812 -2.43885 3.16812 -2.134 3.16812 -2.02042C3.16812 -1.87696 3.10834 -1.63786 3.06052 -1.44658L2.8274 -0.514072Z"
        id="g3-109"
      />
      <path
        d="M0.579826 0.723288C0.537983 0.878705 0.532005 0.920548 0.274969 0.920548C0.19726 0.920548 0.161395 0.920548 0.137484 0.956413C0.125529 0.980324 0.101619 1.05803 0.101619 1.07597C0.107597 1.0939 0.113574 1.15965 0.19726 1.15965C0.364633 1.15965 0.561893 1.13574 0.735243 1.13574C0.842839 1.13574 0.956413 1.14172 1.06401 1.14172C1.16563 1.14172 1.28518 1.15965 1.3868 1.15965C1.42267 1.15965 1.46451 1.15965 1.48842 1.11781C1.50037 1.09988 1.52428 1.02814 1.52428 1.00423C1.50635 0.920548 1.44658 0.920548 1.34496 0.920548C1.20149 0.920548 1.04608 0.920548 1.04608 0.848817C1.04608 0.818929 1.08792 0.663512 1.11183 0.573848L1.32702 -0.298879C1.47049 -0.0836862 1.69166 0.0597758 1.98456 0.0597758C2.7736 0.0597758 3.58057 -0.765131 3.58057 -1.61993C3.58057 -2.24159 3.14421 -2.63611 2.61818 -2.63611C2.134 -2.63611 1.75741 -2.24757 1.72752 -2.21171C1.61993 -2.56438 1.24932 -2.63611 1.07597 -2.63611C0.800996 -2.63611 0.657534 -2.43885 0.579826 -2.30735C0.436364 -2.05629 0.364633 -1.74545 0.364633 -1.72154C0.364633 -1.65579 0.418431 -1.63188 0.472229 -1.63188C0.56787 -1.63188 0.573848 -1.67372 0.603736 -1.76936C0.729265 -2.2655 0.872727 -2.43885 1.05803 -2.43885C1.27323 -2.43885 1.27323 -2.19377 1.27323 -2.134C1.27323 -2.03238 1.26725 -2.01445 1.25529 -1.96065L0.579826 0.723288ZM1.70361 -1.79925C1.7335 -1.90087 1.7335 -1.91283 1.8411 -2.03238C2.03238 -2.24757 2.3193 -2.43885 2.60025 -2.43885C2.88717 -2.43885 3.07248 -2.21768 3.07248 -1.85305C3.07248 -1.64981 2.95293 -0.986301 2.7198 -0.621669C2.51656 -0.310834 2.23562 -0.137484 1.98456 -0.137484C1.53624 -0.137484 1.41669 -0.603736 1.41669 -0.651557C1.41669 -0.681445 1.42864 -0.71731 1.43462 -0.74122L1.70361 -1.79925Z"
        id="g3-112"
      />
      <path
        d="M2.73176 -2.24757C2.55841 -2.20573 2.49265 -2.05629 2.49265 -1.96663C2.49265 -1.87098 2.56438 -1.76936 2.70187 -1.76936C2.82142 -1.76936 2.99477 -1.85305 2.99477 -2.11009C2.99477 -2.51059 2.54047 -2.63611 2.15193 -2.63611C1.23736 -2.63611 1.01619 -2.03238 1.01619 -1.77534C1.01619 -1.29116 1.56613 -1.19552 1.72154 -1.17161C2.16986 -1.0939 2.51656 -1.02814 2.51656 -0.735243C2.51656 -0.609714 2.41494 -0.394521 2.19975 -0.274969C1.96663 -0.14944 1.70959 -0.137484 1.53624 -0.137484C1.32702 -0.137484 0.956413 -0.161395 0.783064 -0.358655C0.992279 -0.394521 1.0939 -0.555915 1.0939 -0.699377C1.0939 -0.824907 1.01021 -0.926526 0.848817 -0.926526C0.6934 -0.926526 0.502117 -0.800996 0.502117 -0.52005C0.502117 -0.191283 0.830884 0.0597758 1.53026 0.0597758C2.64807 0.0597758 2.88717 -0.633624 2.88717 -0.908593C2.88717 -1.10585 2.80349 -1.24334 2.666 -1.36289C2.47472 -1.53026 2.25355 -1.56613 1.96663 -1.61395C1.67372 -1.66775 1.3868 -1.71557 1.3868 -1.94869C1.3868 -1.95467 1.3868 -2.43885 2.14595 -2.43885C2.29539 -2.43885 2.59427 -2.41494 2.73176 -2.24757Z"
        id="g3-115"
      />
      <path
        d="M1.60797 -2.33724H2.25953C2.37908 -2.33724 2.46276 -2.33724 2.46276 -2.48667C2.46276 -2.57634 2.38506 -2.57634 2.27746 -2.57634H1.66775L1.87696 -3.40125C1.90087 -3.49091 1.90087 -3.52677 1.90087 -3.53275C1.90087 -3.67621 1.7873 -3.73599 1.69166 -3.73599C1.61993 -3.73599 1.46451 -3.69415 1.41071 -3.50286L1.17758 -2.57634H0.532005C0.406476 -2.57634 0.400498 -2.57036 0.376588 -2.55243C0.3467 -2.52852 0.32279 -2.45081 0.32279 -2.42092C0.340722 -2.33724 0.394521 -2.33724 0.514072 -2.33724H1.11781L0.765131 -0.926526C0.729265 -0.789041 0.681445 -0.585803 0.681445 -0.514072C0.681445 -0.167372 0.992279 0.0597758 1.35691 0.0597758C2.04433 0.0597758 2.45081 -0.759153 2.45081 -0.860772C2.45081 -0.878705 2.43885 -0.944458 2.33724 -0.944458C2.25953 -0.944458 2.24757 -0.91457 2.21768 -0.842839C2.01445 -0.394521 1.67372 -0.137484 1.38082 -0.137484C1.15965 -0.137484 1.15367 -0.358655 1.15367 -0.436364C1.15367 -0.52005 1.15367 -0.532005 1.18356 -0.645579L1.60797 -2.33724Z"
        id="g3-116"
      />
      <path
        d="M3.36538 -2.34919C3.15616 -2.28941 3.10834 -2.11606 3.10834 -2.0264C3.10834 -1.83512 3.26376 -1.79328 3.34745 -1.79328C3.5208 -1.79328 3.69415 -1.93674 3.69415 -2.16986C3.69415 -2.49265 3.34147 -2.63611 3.03661 -2.63611C2.64209 -2.63611 2.40299 -2.33126 2.33724 -2.21768C2.25953 -2.36712 2.03238 -2.63611 1.58406 -2.63611C0.896638 -2.63611 0.490162 -1.92478 0.490162 -1.71557C0.490162 -1.68568 0.514072 -1.63188 0.597758 -1.63188S0.699377 -1.66775 0.71731 -1.72154C0.86675 -2.20573 1.27323 -2.43885 1.56613 -2.43885S1.94869 -2.24757 1.94869 -2.05031C1.94869 -1.97858 1.94869 -1.92478 1.90087 -1.73948C1.76339 -1.18356 1.63188 -0.639601 1.60199 -0.56787C1.51233 -0.340722 1.29714 -0.137484 1.04608 -0.137484C1.01021 -0.137484 0.842839 -0.137484 0.705355 -0.227148C0.938481 -0.304857 0.962391 -0.502117 0.962391 -0.549938C0.962391 -0.705355 0.842839 -0.783064 0.723288 -0.783064C0.555915 -0.783064 0.376588 -0.651557 0.376588 -0.406476C0.376588 -0.0657534 0.753176 0.0597758 1.03412 0.0597758C1.37484 0.0597758 1.61993 -0.17335 1.7335 -0.358655C1.85305 -0.107597 2.13998 0.0597758 2.4807 0.0597758C3.18605 0.0597758 3.58057 -0.663512 3.58057 -0.860772C3.58057 -0.872727 3.5746 -0.944458 3.467 -0.944458C3.38331 -0.944458 3.37136 -0.902615 3.35342 -0.848817C3.18007 -0.328767 2.75567 -0.137484 2.50461 -0.137484C2.27746 -0.137484 2.11606 -0.268991 2.11606 -0.52005C2.11606 -0.633624 2.14595 -0.765131 2.19975 -0.974346L2.39103 -1.75143C2.45081 -1.98456 2.4807 -2.09215 2.60623 -2.23562C2.68991 -2.32528 2.83337 -2.43885 3.02466 -2.43885C3.05455 -2.43885 3.23387 -2.43885 3.36538 -2.34919Z"
        id="g3-120"
      />
      <path
        d="M4.75816 -1.33898C4.8538 -1.33898 5.00324 -1.33898 5.00324 -1.4944S4.8538 -1.64981 4.75816 -1.64981H0.992279C0.896638 -1.64981 0.747198 -1.64981 0.747198 -1.4944S0.896638 -1.33898 0.992279 -1.33898H4.75816Z"
        id="g1-0"
      />
      <path
        d="M2.14595 -3.79577C2.14595 -3.97509 2.12204 -3.97509 1.94271 -3.97509C1.54819 -3.59253 0.938481 -3.59253 0.723288 -3.59253V-3.3594C0.878705 -3.3594 1.27323 -3.3594 1.63188 -3.52677V-0.508095C1.63188 -0.310834 1.63188 -0.233126 1.01619 -0.233126H0.759153V0C1.08792 -0.0239103 1.55417 -0.0239103 1.88892 -0.0239103S2.68991 -0.0239103 3.01868 0V-0.233126H2.76164C2.14595 -0.233126 2.14595 -0.310834 2.14595 -0.508095V-3.79577Z"
        id="g5-49"
      />
      <path
        d="M3.59851 -1.42267C3.53873 -1.21943 3.53873 -1.19552 3.37136 -0.968369C3.10834 -0.633624 2.58232 -0.119552 2.02042 -0.119552C1.53026 -0.119552 1.25529 -0.561893 1.25529 -1.26725C1.25529 -1.92478 1.6259 -3.26376 1.85305 -3.76588C2.25953 -4.60274 2.82142 -5.03313 3.28767 -5.03313C4.07671 -5.03313 4.23213 -4.0528 4.23213 -3.95716C4.23213 -3.94521 4.19626 -3.78979 4.18431 -3.76588L3.59851 -1.42267ZM4.36364 -4.48319C4.23213 -4.79402 3.90934 -5.27223 3.28767 -5.27223C1.93674 -5.27223 0.478207 -3.52677 0.478207 -1.75741C0.478207 -0.573848 1.17161 0.119552 1.98456 0.119552C2.64209 0.119552 3.20399 -0.394521 3.53873 -0.789041C3.65828 -0.0836862 4.22017 0.119552 4.57883 0.119552S5.22441 -0.0956413 5.4396 -0.526027C5.63088 -0.932503 5.79826 -1.66177 5.79826 -1.70959C5.79826 -1.76936 5.75044 -1.81719 5.6787 -1.81719C5.57111 -1.81719 5.55915 -1.75741 5.51133 -1.57808C5.332 -0.872727 5.10486 -0.119552 4.61469 -0.119552C4.268 -0.119552 4.24408 -0.430386 4.24408 -0.669489C4.24408 -0.944458 4.27995 -1.07597 4.38755 -1.54222C4.47123 -1.8411 4.53101 -2.10411 4.62665 -2.45081C5.06899 -4.24408 5.17659 -4.67447 5.17659 -4.7462C5.17659 -4.91357 5.04508 -5.04508 4.86575 -5.04508C4.48319 -5.04508 4.38755 -4.62665 4.36364 -4.48319Z"
        id="g4-97"
      />
      <path
        d="M2.13998 -2.7736C2.46276 -2.7736 3.27572 -2.79751 3.84956 -3.0127C4.75816 -3.3594 4.84184 -4.0528 4.84184 -4.268C4.84184 -4.79402 4.38755 -5.27223 3.59851 -5.27223C2.34321 -5.27223 0.537983 -4.13649 0.537983 -2.00847C0.537983 -0.753176 1.25529 0.119552 2.34321 0.119552C3.96912 0.119552 4.99726 -1.1477 4.99726 -1.30311C4.99726 -1.37484 4.92553 -1.43462 4.87771 -1.43462C4.84184 -1.43462 4.82989 -1.42267 4.72229 -1.31507C3.95716 -0.298879 2.82142 -0.119552 2.36712 -0.119552C1.68568 -0.119552 1.32702 -0.657534 1.32702 -1.54222C1.32702 -1.70959 1.32702 -2.00847 1.50635 -2.7736H2.13998ZM1.56613 -3.0127C2.0802 -4.8538 3.21594 -5.03313 3.59851 -5.03313C4.12453 -5.03313 4.48319 -4.72229 4.48319 -4.268C4.48319 -3.0127 2.57036 -3.0127 2.06824 -3.0127H1.56613Z"
        id="g4-101"
      />
      <path
        d="M3.03661 -7.99801C3.04857 -8.04583 3.07248 -8.11756 3.07248 -8.17733C3.07248 -8.29689 2.95293 -8.29689 2.92902 -8.29689C2.91706 -8.29689 2.48667 -8.26102 2.27148 -8.23711C2.06824 -8.22516 1.88892 -8.20125 1.67372 -8.18929C1.3868 -8.16538 1.30311 -8.15342 1.30311 -7.93823C1.30311 -7.81868 1.42267 -7.81868 1.54222 -7.81868C2.15193 -7.81868 2.15193 -7.71108 2.15193 -7.59153C2.15193 -7.54371 2.15193 -7.5198 2.09215 -7.30461L0.609714 -1.37484C0.573848 -1.24334 0.549938 -1.1477 0.549938 -0.956413C0.549938 -0.358655 0.992279 0.119552 1.60199 0.119552C1.99651 0.119552 2.25953 -0.143462 2.45081 -0.514072C2.65405 -0.908593 2.82142 -1.66177 2.82142 -1.70959C2.82142 -1.76936 2.7736 -1.81719 2.70187 -1.81719C2.59427 -1.81719 2.58232 -1.75741 2.5345 -1.57808C2.3193 -0.753176 2.10411 -0.119552 1.6259 -0.119552C1.26725 -0.119552 1.26725 -0.502117 1.26725 -0.669489C1.26725 -0.71731 1.26725 -0.968369 1.35093 -1.30311L3.03661 -7.99801Z"
        id="g4-108"
      />
      <path
        d="M2.46276 -3.50286C2.48667 -3.5746 2.78555 -4.17235 3.2279 -4.55492C3.53873 -4.84184 3.94521 -5.03313 4.41146 -5.03313C4.88966 -5.03313 5.05704 -4.67447 5.05704 -4.19626C5.05704 -4.12453 5.05704 -3.88543 4.91357 -3.32354L4.61469 -2.09215C4.51905 -1.7335 4.29191 -0.848817 4.268 -0.71731C4.22017 -0.537983 4.14844 -0.227148 4.14844 -0.179328C4.14844 -0.0119552 4.27995 0.119552 4.45928 0.119552C4.81793 0.119552 4.87771 -0.155417 4.98531 -0.585803L5.70262 -3.44309C5.72653 -3.53873 6.34819 -5.03313 7.66326 -5.03313C8.14147 -5.03313 8.30884 -4.67447 8.30884 -4.19626C8.30884 -3.52677 7.84259 -2.22366 7.57958 -1.50635C7.47198 -1.21943 7.4122 -1.06401 7.4122 -0.848817C7.4122 -0.310834 7.78281 0.119552 8.35666 0.119552C9.46849 0.119552 9.88692 -1.63786 9.88692 -1.70959C9.88692 -1.76936 9.8391 -1.81719 9.76737 -1.81719C9.65978 -1.81719 9.64782 -1.78132 9.58804 -1.57808C9.31308 -0.621669 8.87073 -0.119552 8.39253 -0.119552C8.27298 -0.119552 8.08169 -0.131507 8.08169 -0.514072C8.08169 -0.824907 8.22516 -1.20747 8.27298 -1.33898C8.48817 -1.91283 9.02615 -3.32354 9.02615 -4.01694C9.02615 -4.73425 8.60772 -5.27223 7.69913 -5.27223C6.89813 -5.27223 6.25255 -4.81793 5.77435 -4.11258C5.73848 -4.75816 5.34396 -5.27223 4.44732 -5.27223C3.38331 -5.27223 2.82142 -4.51905 2.60623 -4.22017C2.57036 -4.90162 2.0802 -5.27223 1.55417 -5.27223C1.20747 -5.27223 0.932503 -5.10486 0.705355 -4.65056C0.490162 -4.22017 0.32279 -3.49091 0.32279 -3.44309S0.37061 -3.33549 0.454296 -3.33549C0.549938 -3.33549 0.561893 -3.34745 0.633624 -3.62242C0.812951 -4.32777 1.0401 -5.03313 1.51831 -5.03313C1.79328 -5.03313 1.88892 -4.84184 1.88892 -4.48319C1.88892 -4.22017 1.76936 -3.75392 1.68568 -3.38331L1.35093 -2.09215C1.30311 -1.86501 1.17161 -1.32702 1.11183 -1.11183C1.02814 -0.800996 0.896638 -0.239103 0.896638 -0.179328C0.896638 -0.0119552 1.02814 0.119552 1.20747 0.119552C1.35093 0.119552 1.51831 0.0478207 1.61395 -0.131507C1.63786 -0.191283 1.74545 -0.609714 1.80523 -0.848817L2.06824 -1.92478L2.46276 -3.50286Z"
        id="g4-109"
      />
      <path
        d="M5.45156 -3.28767C5.45156 -4.42341 4.71034 -5.27223 3.62242 -5.27223C2.04433 -5.27223 0.490162 -3.55068 0.490162 -1.86501C0.490162 -0.729265 1.23138 0.119552 2.3193 0.119552C3.90934 0.119552 5.45156 -1.60199 5.45156 -3.28767ZM2.33126 -0.119552C1.7335 -0.119552 1.29116 -0.597758 1.29116 -1.43462C1.29116 -1.98456 1.57808 -3.20399 1.91283 -3.80174C2.45081 -4.72229 3.1203 -5.03313 3.61046 -5.03313C4.19626 -5.03313 4.65056 -4.55492 4.65056 -3.71806C4.65056 -3.23985 4.3995 -1.96065 3.94521 -1.23138C3.45504 -0.430386 2.79751 -0.119552 2.33126 -0.119552Z"
        id="g4-111"
      />
      <path
        d="M0.514072 1.51831C0.430386 1.87696 0.382565 1.9726 -0.107597 1.9726C-0.251059 1.9726 -0.37061 1.9726 -0.37061 2.19975C-0.37061 2.22366 -0.358655 2.3193 -0.227148 2.3193C-0.071731 2.3193 0.0956413 2.29539 0.251059 2.29539H0.765131C1.01619 2.29539 1.6259 2.3193 1.87696 2.3193C1.94869 2.3193 2.09215 2.3193 2.09215 2.10411C2.09215 1.9726 2.00847 1.9726 1.80523 1.9726C1.25529 1.9726 1.21943 1.88892 1.21943 1.79328C1.21943 1.64981 1.75741 -0.406476 1.82914 -0.681445C1.96065 -0.3467 2.28344 0.119552 2.90511 0.119552C4.25604 0.119552 5.71457 -1.63786 5.71457 -3.39527C5.71457 -4.49514 5.0929 -5.27223 4.19626 -5.27223C3.43113 -5.27223 2.78555 -4.53101 2.65405 -4.36364C2.55841 -4.96139 2.09215 -5.27223 1.61395 -5.27223C1.26725 -5.27223 0.992279 -5.10486 0.765131 -4.65056C0.549938 -4.22017 0.382565 -3.49091 0.382565 -3.44309S0.430386 -3.33549 0.514072 -3.33549C0.609714 -3.33549 0.621669 -3.34745 0.6934 -3.62242C0.872727 -4.32777 1.09988 -5.03313 1.57808 -5.03313C1.85305 -5.03313 1.94869 -4.84184 1.94869 -4.48319C1.94869 -4.19626 1.91283 -4.07671 1.86501 -3.86152L0.514072 1.51831ZM2.58232 -3.73001C2.666 -4.06476 3.00075 -4.41146 3.19203 -4.57883C3.32354 -4.69838 3.71806 -5.03313 4.17235 -5.03313C4.69838 -5.03313 4.93748 -4.5071 4.93748 -3.88543C4.93748 -3.31158 4.60274 -1.96065 4.30386 -1.33898C4.00498 -0.6934 3.45504 -0.119552 2.90511 -0.119552C2.09215 -0.119552 1.96065 -1.1477 1.96065 -1.19552C1.96065 -1.23138 1.98456 -1.32702 1.99651 -1.3868L2.58232 -3.73001Z"
        id="g4-112"
      />
      <path
        d="M2.72578 -2.39103C2.92902 -2.35517 3.25181 -2.28344 3.32354 -2.27148C3.47895 -2.22366 4.01694 -2.03238 4.01694 -1.45853C4.01694 -1.08792 3.68219 -0.119552 2.29539 -0.119552C2.04433 -0.119552 1.1477 -0.155417 0.908593 -0.812951C1.3868 -0.753176 1.6259 -1.12379 1.6259 -1.3868C1.6259 -1.63786 1.45853 -1.76936 1.21943 -1.76936C0.956413 -1.76936 0.609714 -1.56613 0.609714 -1.02814C0.609714 -0.32279 1.32702 0.119552 2.28344 0.119552C4.10062 0.119552 4.63861 -1.21943 4.63861 -1.8411C4.63861 -2.02042 4.63861 -2.35517 4.25604 -2.73773C3.95716 -3.02466 3.67024 -3.08443 3.02466 -3.21594C2.70187 -3.28767 2.1878 -3.39527 2.1878 -3.93325C2.1878 -4.17235 2.40299 -5.03313 3.53873 -5.03313C4.04085 -5.03313 4.53101 -4.84184 4.65056 -4.41146C4.12453 -4.41146 4.10062 -3.95716 4.10062 -3.94521C4.10062 -3.69415 4.32777 -3.62242 4.43537 -3.62242C4.60274 -3.62242 4.93748 -3.75392 4.93748 -4.25604S4.48319 -5.27223 3.55068 -5.27223C1.98456 -5.27223 1.56613 -4.04085 1.56613 -3.55068C1.56613 -2.64209 2.45081 -2.45081 2.72578 -2.39103Z"
        id="g4-115"
      />
      <path
        d="M2.40299 -4.80598H3.50286C3.73001 -4.80598 3.84956 -4.80598 3.84956 -5.02117C3.84956 -5.15268 3.77783 -5.15268 3.53873 -5.15268H2.48667L2.92902 -6.89813C2.97684 -7.0655 2.97684 -7.08941 2.97684 -7.1731C2.97684 -7.36438 2.82142 -7.47198 2.666 -7.47198C2.57036 -7.47198 2.29539 -7.43611 2.19975 -7.05355L1.7335 -5.15268H0.609714C0.37061 -5.15268 0.263014 -5.15268 0.263014 -4.92553C0.263014 -4.80598 0.3467 -4.80598 0.573848 -4.80598H1.63786L0.848817 -1.64981C0.753176 -1.23138 0.71731 -1.11183 0.71731 -0.956413C0.71731 -0.394521 1.11183 0.119552 1.78132 0.119552C2.98879 0.119552 3.63437 -1.6259 3.63437 -1.70959C3.63437 -1.78132 3.58655 -1.81719 3.51482 -1.81719C3.49091 -1.81719 3.44309 -1.81719 3.41918 -1.76936C3.40722 -1.75741 3.39527 -1.74545 3.31158 -1.55417C3.06052 -0.956413 2.51059 -0.119552 1.81719 -0.119552C1.45853 -0.119552 1.43462 -0.418431 1.43462 -0.681445C1.43462 -0.6934 1.43462 -0.920548 1.47049 -1.06401L2.40299 -4.80598Z"
        id="g4-116"
      />
      <path
        d="M3.47497 -1.80922H5.81818C5.92976 -1.80922 6.10511 -1.80922 6.10511 -1.99253S5.92976 -2.17584 5.81818 -2.17584H3.47497V-4.52702C3.47497 -4.63861 3.47497 -4.81395 3.29166 -4.81395S3.10834 -4.63861 3.10834 -4.52702V-2.17584H0.757161C0.645579 -2.17584 0.470237 -2.17584 0.470237 -1.99253S0.645579 -1.80922 0.757161 -1.80922H3.10834V0.541968C3.10834 0.653549 3.10834 0.828892 3.29166 0.828892S3.47497 0.653549 3.47497 0.541968V-1.80922Z"
        id="g6-43"
      />
      <path
        d="M2.50262 -5.07696C2.50262 -5.29215 2.48667 -5.30012 2.27148 -5.30012C1.94471 -4.98132 1.52229 -4.79004 0.765131 -4.79004V-4.52702C0.980324 -4.52702 1.41071 -4.52702 1.87298 -4.74222V-0.653549C1.87298 -0.358655 1.84907 -0.263014 1.09191 -0.263014H0.812951V0C1.13973 -0.0239103 1.82516 -0.0239103 2.18381 -0.0239103S3.23587 -0.0239103 3.56264 0V-0.263014H3.28369C2.52653 -0.263014 2.50262 -0.358655 2.50262 -0.653549V-5.07696Z"
        id="g6-49"
      />
      <path
        d="M3.88543 2.90511C3.88543 2.86924 3.88543 2.84533 3.68219 2.64209C2.48667 1.43462 1.81719 -0.537983 1.81719 -2.97684C1.81719 -5.29614 2.37908 -7.29265 3.76588 -8.70336C3.88543 -8.81096 3.88543 -8.83487 3.88543 -8.87073C3.88543 -8.94247 3.82565 -8.96638 3.77783 -8.96638C3.62242 -8.96638 2.64209 -8.1056 2.05629 -6.934C1.44658 -5.72653 1.17161 -4.44732 1.17161 -2.97684C1.17161 -1.91283 1.33898 -0.490162 1.96065 0.789041C2.666 2.22366 3.64633 3.00075 3.77783 3.00075C3.82565 3.00075 3.88543 2.97684 3.88543 2.90511Z"
        id="g7-40"
      />
      <path
        d="M3.37136 -2.97684C3.37136 -3.88543 3.25181 -5.36787 2.58232 -6.75467C1.87696 -8.18929 0.896638 -8.96638 0.765131 -8.96638C0.71731 -8.96638 0.657534 -8.94247 0.657534 -8.87073C0.657534 -8.83487 0.657534 -8.81096 0.860772 -8.60772C2.05629 -7.40025 2.72578 -5.42765 2.72578 -2.98879C2.72578 -0.669489 2.16389 1.32702 0.777086 2.73773C0.657534 2.84533 0.657534 2.86924 0.657534 2.90511C0.657534 2.97684 0.71731 3.00075 0.765131 3.00075C0.920548 3.00075 1.90087 2.13998 2.48667 0.968369C3.09639 -0.251059 3.37136 -1.54222 3.37136 -2.97684Z"
        id="g7-41"
      />
      <path
        d="M8.06974 -3.87347C8.23711 -3.87347 8.4523 -3.87347 8.4523 -4.08867C8.4523 -4.31582 8.24907 -4.31582 8.06974 -4.31582H1.02814C0.860772 -4.31582 0.645579 -4.31582 0.645579 -4.10062C0.645579 -3.87347 0.848817 -3.87347 1.02814 -3.87347H8.06974ZM8.06974 -1.64981C8.23711 -1.64981 8.4523 -1.64981 8.4523 -1.86501C8.4523 -2.09215 8.24907 -2.09215 8.06974 -2.09215H1.02814C0.860772 -2.09215 0.645579 -2.09215 0.645579 -1.87696C0.645579 -1.64981 0.848817 -1.64981 1.02814 -1.64981H8.06974Z"
        id="g7-61"
      />
    </defs>
    <g id="page1" transform="matrix(1.5 0 0 1.5 0 0)">
      <use x={142.541} xlinkHref="#g4-112" y={102.069} />
      <use x={148.394} xlinkHref="#g4-116" y={102.069} />
      <use x={152.606} xlinkHref="#g4-115" y={102.069} />
      <use x={161.42} xlinkHref="#g7-61" y={102.069} />
      <use x={173.812} xlinkHref="#g4-108" y={102.069} />
      <use x={177.548} xlinkHref="#g4-101" y={102.069} />
      <use x={182.954} xlinkHref="#g4-97" y={102.069} />
      <use x={189.076} xlinkHref="#g4-115" y={102.069} />
      <use x={194.569} xlinkHref="#g4-116" y={102.069} />
      <use x={201.437} xlinkHref="#g2-3" y={102.069} />
      <use x={210.049} xlinkHref="#g0-18" y={85.212} />
      <use x={220.045} xlinkHref="#g4-109" y={93.9812} />
      <use x={230.246} xlinkHref="#g4-111" y={93.9812} />
      <use x={235.852} xlinkHref="#g4-115" y={93.9812} />
      <use x={241.346} xlinkHref="#g4-116" y={93.9812} />
      <rect height={0.478187} width={25.6079} x={220.045} y={98.8411} />
      <use x={220.318} xlinkHref="#g4-108" y={110.27} />
      <use x={224.055} xlinkHref="#g4-101" y={110.27} />
      <use x={229.46} xlinkHref="#g4-97" y={110.27} />
      <use x={235.582} xlinkHref="#g4-115" y={110.27} />
      <use x={241.075} xlinkHref="#g4-116" y={110.27} />
      <use x={246.848} xlinkHref="#g0-19" y={85.212} />
      <use x={255.649} xlinkHref="#g7-40" y={88.8849} />
      <use x={260.201} xlinkHref="#g6-49" y={87.8887} />
      <use x={264.419} xlinkHref="#g6-43" y={87.8887} />
      <use x={279.044} xlinkHref="#g5-49" y={84.528} />
      <use x={282.683} xlinkHref="#g1-0" y={84.528} />
      <use x={288.418} xlinkHref="#g3-120" y={84.528} />
      <rect height={0.358656} width={27.3155} x={272.177} y={85.7168} />
      <use x={272.177} xlinkHref="#g3-109" y={91.0143} />
      <use x={278.69} xlinkHref="#g3-97" y={91.0143} />
      <use x={282.709} xlinkHref="#g3-112" y={91.0143} />
      <use x={286.535} xlinkHref="#g3-115" y={91.0143} />
      <use x={290.016} xlinkHref="#g1-0" y={91.0143} />
      <use x={295.751} xlinkHref="#g5-49" y={91.0143} />
      <use x={300.688} xlinkHref="#g7-41" y={88.8849} />
      <use x={305.28} xlinkHref="#g3-115" y={82.3815} />
      <use x={308.761} xlinkHref="#g3-116" y={82.3815} />
      <use x={311.601} xlinkHref="#g3-101" y={82.3815} />
      <use x={315.109} xlinkHref="#g3-101" y={82.3815} />
      <use x={318.616} xlinkHref="#g3-112" y={82.3815} />
    </g>
  </svg>
);
