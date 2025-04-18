import styles from "../maplist.module.css";
import DifficultySelector from "@/components/maps/DifficultySelector";
import { botbDifficulties, discordInvites } from "@/utils/maplistUtils";
import SubmissionRules from "@/components/layout/maplists/SubmissionRules";
import MapList from "@/components/layout/maplists/MapList";
import { getMaplist } from "@/server/maplistRequests";

export async function generateMetadata({ searchParams }) {
  let difficulty = searchParams.difficulty || "beginner";
  if (!botbDifficulties.map(({ query }) => query).includes(difficulty))
    difficulty = "casual";

  let curDifficulty =
    botbDifficulties.find(({ query }) => difficulty === query) ||
    botbDifficulties[0];

  return {
    title: `Best of the Best ${curDifficulty.name} Maps | BTD6 Maplist`,
    description: `A list of difficult community-made Bloons TD 6 maps. ${curDifficulty.meta_desc}`,
  };
}

export default async function Experts({ searchParams }) {
  let difficulty = searchParams.difficulty || "casual";
  if (!botbDifficulties.map(({ query }) => query).includes(difficulty))
    difficulty = "casual";

  let curDifficulty =
    botbDifficulties.find(({ query }) => difficulty === query) ||
    botbDifficulties[0];
  const curDifficulties =
    curDifficulty?.difficuly_values || curDifficulty?.value;

  const listPromises = Array.isArray(curDifficulties)
    ? curDifficulties.map((filter) => getMaplist({ format: 52, filter }))
    : [getMaplist({ format: 52, filter: curDifficulties })];

  const maplist = (await Promise.all(listPromises)).reduce(
    (prev, cur) => [...prev, ...cur],
    []
  );

  return (
    <>
      <h1 className="text-center">Best of the Best Custom Maps</h1>

      <div>
        <DifficultySelector
          value={curDifficulty.value}
          difficulties={botbDifficulties}
          href="/best-of-the-best?difficulty={queryval}"
        />
        <p className={`${styles.diffDesc}`}>{curDifficulty.description}</p>
        <p className={`${styles.diffDesc}`}>
          Join the{" "}
          <a href={discordInvites.emporium} target="_blank">
            BTD6 Map Emporium
          </a>{" "}
          if you would like to interact with the community more!
        </p>

        <SubmissionRules on={52} />

        <MapList
          maps={maplist.filter((map) =>
            Array.isArray(curDifficulties)
              ? curDifficulties.includes(map.format_idx)
              : map.format_idx === curDifficulties
          )}
          completionFormats={[51, 1, 52, 11]}
          listFormat={52}
          extremeDifficulties={[4]}
        />
      </div>
    </>
  );
}
