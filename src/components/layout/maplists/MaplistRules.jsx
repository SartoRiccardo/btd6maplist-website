"use client";
import Medal from "@/components/ui/Medal";
import { useMaplistConfig } from "@/utils/hooks";
import { allFormats, difficulties } from "@/utils/maplistUtils";
import Link from "next/link";

function ShowOnFormats({ on, formats, children }) {
  if (!formats.includes(on)) return null;

  return children;
}

export function RunSubmissionRules({ on }) {
  const maplistCfg = useMaplistConfig();
  on = on || 1;
  const format = allFormats.find(({ value }) => value === on);

  return (
    <div className="panel pt-3 px-3" data-cy={`rules-for-${on}`}>
      {format && (
        <h2 className="text-center">
          <Medal src={format.image} border padHeight="bottom" /> {format.name}{" "}
          Completion Submission Rules
        </h2>
      )}
      <h3 className="text-center">How to Submit</h3>
      <p>
        To submit a run, you must submit a valid screenshot after Round 100 is
        completed by showing either the tower screen after pressing the{" "}
        <i>Review Map</i> button, or that the current round is 101 or higher.
        You can submit runs either through the Maplist Discord server or by
        clicking the <b>Submit Run</b> button on the website on a map's page.
        <br />
        <br />
        Be prepared to list your build order, hardest rounds, early game setup,
        etc. if your run is deemed suspicious.{" "}
        <span className="muted">
          Doesn't happen often, but it <i>can</i> happen.
        </span>
      </p>

      <ShowOnFormats on={on} formats={[51, 1, 2]}>
        <h3 className="text-center">
          Black Border Runs, Alt Hero Runs, and LCCs
        </h3>
        <h3>Point modifiers</h3>
        <ShowOnFormats on={on} formats={[1, 2]}>
          <ul>
            <li>
              Black Border runs are worth{" "}
              <b>
                <u>{maplistCfg.points_multi_bb}x points</u>
              </b>
            </li>
            <li>
              Alt Hero runs (heroes other than the best hero(s) on the map) are
              worth{" "}
              <b>
                <u>{maplistCfg.points_multi_gerry}x points</u>
              </b>
            </li>
            <li>
              LCCs are worth{" "}
              <b>
                <u>+{maplistCfg.points_extra_lcc} points</u>
              </b>
            </li>
          </ul>
        </ShowOnFormats>
        <ShowOnFormats on={on} formats={[51]}>
          <ul>
            <li>
              <Medal src="/medals/medal_nogerry.webp" padHeight /> No Optimal
              Hero runs (heroes other than the best hero(s) on the map) are
              worth:
              <ul>
                {difficulties.map(({ query, value, points_cfg, name }) => {
                  const pointsNoGerryCfg = points_cfg.replace(
                    "_points",
                    "_nogerry_points"
                  );
                  return (
                    maplistCfg[pointsNoGerryCfg] > 0 && (
                      <li key={value}>
                        <Medal
                          src={`/format_icons/icon_${query}.webp`}
                          border
                          padHeight
                        />{" "}
                        On {name} Expert maps:&nbsp;
                        <b>
                          <u>
                            +{maplistCfg[pointsNoGerryCfg]} point
                            {maplistCfg[pointsNoGerryCfg] > 1 && "s"}
                          </u>
                        </b>
                      </li>
                    )
                  );
                })}
              </ul>
            </li>
            {maplistCfg.exp_bb_multi !== 1 && (
              <li>
                <Medal src="/medals/medal_bb.webp" padHeight /> Black Border
                runs multiply the map's <b>base</b> points by{" "}
                <b>x{maplistCfg.exp_bb_multi}</b>
              </li>
            )}
            {maplistCfg.exp_lcc_extra !== 0 && (
              <li>
                <Medal src="/medals/medal_lcc.webp" padHeight /> Holding the
                Least Cost CHIMPS on a map awards you{" "}
                <b>+{maplistCfg.exp_lcc_extra}</b> points on it
              </li>
            )}
          </ul>
        </ShowOnFormats>
      </ShowOnFormats>

      <h3>Proof Requirements</h3>
      <ul>
        <ShowOnFormats on={on} formats={[1, 2, 51]}>
          <li>
            <Medal src="/medals/medal_bb.webp" padHeight /> Black Border runs
            must have completely unedited video proof
          </li>
        </ShowOnFormats>
        <li>
          <Medal src="/medals/medal_lcc.webp" padHeight /> LCC runs must be
          streamed with 1 moderator as witness, or have video proof following
          the requirements below.
        </li>
        <ShowOnFormats on={on} formats={[1, 2]}>
          <li>
            <Medal src="/medals/medal_nogerry.webp" padHeight /> No Optimal Hero
            runs must be streamed with 1 moderator as witness, or have video
            proof following the requirements below.
          </li>
        </ShowOnFormats>
        <ShowOnFormats on={on} formats={[51]}>
          <li>
            <Medal src="/medals/medal_nogerry.webp" padHeight /> For No Optimal
            Hero runs:
            <ul>
              <li>
                No Optimal Hero runs <u>on High, True and Extreme experts</u>{" "}
                must be streamed with 1 moderator as witness, or have video
                proof following the requirements below.
              </li>
              <li>
                Adora runs on Casual and Medium Experts require an additional
                screenshot at the start of Round 98.
              </li>
            </ul>
          </li>
        </ShowOnFormats>
      </ul>

      <h3 className="text-center mb-2">Recording Requirements</h3>
      <p className="text-center muted">
        Recordings are not always needed for proofs. Check the rules to see if
        your run does
      </p>
      <ul>
        <li>In game music and SFX must be audible and not at 0%.</li>
        <li>
          Audio must only consist of the game itself, and any VC audio during
          recording.
        </li>
        <ShowOnFormats on={on} formats={[1, 2]}>
          <li>
            The recording must consist of unedited clips of each round from{" "}
            <u>91 - 100</u> (unlike the Expert List, which requires 98 - 100).
          </li>
        </ShowOnFormats>
        <ShowOnFormats on={on} formats={[51, 11, 52]}>
          <li>
            The recording must consist of unedited clips of each round from{" "}
            <u>98 - 100</u> (unlike The Maplist, which requires 91 - 100).
          </li>
        </ShowOnFormats>
        <li>
          Any splices or sections in the recording must reveal all installed
          mods.
        </li>
        <li>
          Once you beat r100 you must go home and once again show your mod list
          or lack thereof.
        </li>
      </ul>

      <h3 className="text-center mb-2">
        Allowed/Forbidden Mods, Hacks and Glitches
      </h3>
      <p className="text-center text-warning">
        <u>
          WARNING: Using mods can result in your account getting flagged. It is
          recommended you use an alt account when modding
        </u>
      </p>
      <p>
        Your run may not make use of hacking or game breaking bugs in any way.
        Exceptions are listed below:
      </p>
      <ul>
        <li>Faster Forward Mod</li>
        <li>Auto Nudge Mod</li>
        <li>Time Machine Mod</li>
        <li>Useful Utilities (only v1.2.0+)</li>
      </ul>

      <h3 className="text-center">Game Cosmetics and Secret Modifiers</h3>
      <p>
        <u>Monkey modifiers</u> (smaller monkeys, bigger monkeys, ...) are{" "}
        <u>NOT</u> allowed. Smaller bloons, bigger bloons, and all cosmetics in
        the trophy store are still allowed.
      </p>
    </div>
  );
}

export function MapSubmissionRules({ on }) {
  on = on || 1;
  const format = allFormats.find(({ value }) => value === on);

  return (
    <div className="panel pt-3 px-3" data-cy={`rules-for-${on}`}>
      {format && (
        <h2 className="text-center">
          <Medal src={format.image} border padHeight="bottom" /> {format.name}{" "}
          Map Submission Rules
        </h2>
      )}
      <ShowOnFormats on={on} formats={[1, 2, 51]}>
        <h3 className="text-center">Verify maps in the current update only</h3>
        <p>
          Your map must be verified in the current update in order to be
          accepted, maps verified and accepted in older updates will remain on
          the list unless proven impossible.
        </p>
        <h3 className="text-center">List Changes</h3>
        <h3>Impossible maps will be removed</h3>
        <p>
          Maps deemed to be impossible on chimps by the list moderators will be
          removed from the list until verified in the current update.
        </p>
        <h3>Changing List Maps</h3>
        <p>
          You may not replace a current list map with an updated version unless
          that map falls of the list or if the map has identical gameplay.
          <br />
          Once a map is on list it may not be removed unless both the creators
          and victors of the map agree with removing the map, or unless other
          removal rules apply.
        </p>
        <h3 className="text-center">List Map Quality Standards</h3>
        <ShowOnFormats on={on} formats={[1, 2]}>
          <p>
            Whether the map meets our quality standard will be determined by a
            vote by list moderators.{" "}
            <i>Generally these standards arent too strict,</i>
            you can use recently accepted maps as a point of reference.
          </p>
        </ShowOnFormats>
        <ShowOnFormats on={on} formats={[51]}>
          <p>
            Whether the map meets our quality standard will be determined by a
            vote by list moderators.{" "}
            <i>
              These standards are much higher than the ones on the maplist due
              to the list promoting gameplay design as well as difficulty.
            </i>{" "}
            You can use recently accepted maps as a point of reference.
          </p>
        </ShowOnFormats>
        <p>
          In general, if a map is rejected, it falls in one or more of these
          categories:
        </p>

        <ol>
          <li>Map is too similar to an existing map.</li>
          <li>Map does not meet the required difficulty.</li>
          <li>Map does not meet the required visual quality.</li>
          <li>Map does not meet the required gameplay quality.</li>
        </ol>
      </ShowOnFormats>

      <ShowOnFormats on={on} formats={[52]}>
        <h3 className="text-center">Map Selection</h3>
        <ul>
          <li>
            Maps are added based on a variety of factors such as{" "}
            <b>gameplay, visuals, and thematic consistency.</b> A map that is
            very beautiful but unintuitive to play will not get added, and a map
            that is very fun but visually unappealing will not get added.
          </li>
          <li>
            Pathing should not be overly confusing;{" "}
            <b>A map should want to be played.</b>
          </li>
          <li>
            A map that doesn't know its own theme will not get added, ie: some
            props indicate the map takes place in the wild west, while others
            indicate it's a beach resort.
          </li>
          <li>
            <b>Simple = Better.</b> Maps don't get chosen by how detailed and
            technically impressive they are.{" "}
            <b>A map must function well as a BTD6 map</b>, first and foremost.
            That means no obvious visual glitches or illogical perspectives.
          </li>
          <li>
            Remake Policy: Remakes of past BTD maps will only get added if they
            are particularly impressive.{" "}
            <Link href="/nostalgia-pack">The Nostalgia Pack</Link> already
            exists, providing a substantial collection of maps from previous BTD
            games.
            <ul>
              <li>
                <i>Why so many remakes?</i> Ninja Kiwi is exceptional at making
                maps with strong gameplay, visuals, and thematic consistency.
                So, naturally, strong reproductions of their maps meet Best of
                the Best criteria.
              </li>
            </ul>
          </li>
        </ul>

        <h3 className="text-center">CHIMPS Verification</h3>
        <p>
          Only expert maps require a screenshot of CHIMPS completion. All other
          maps are assumed to be easier than expert maps and thus possible on
          every difficulty
        </p>
      </ShowOnFormats>

      <ShowOnFormats on={on} formats={[11]}>
        <h3 className="text-center">Map Selection</h3>
        <ul>
          <li>Maps are selected based on quality and accuracy</li>
          <li>
            Maps that are more faithful to the original are more likely to get
            added
          </li>
        </ul>
      </ShowOnFormats>
    </div>
  );
}
