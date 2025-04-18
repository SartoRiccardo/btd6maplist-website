import styles from "../maplist.module.css";
import DifficultySelector from "@/components/maps/DifficultySelector";
import { difficulties, discordInvites } from "@/utils/maplistUtils";
import { getMaplist } from "@/server/maplistRequests";
import SubmissionRules from "@/components/layout/maplists/SubmissionRules";
import MapList from "@/components/layout/maplists/MapList";

export async function generateMetadata({ searchParams }) {
  let difficulty = searchParams.difficulty || "casual";
  if (!difficulties.map(({ query }) => query).includes(difficulty))
    difficulty = "casual";

  let curDifficulty =
    difficulties.find(({ query }) => difficulty === query) || difficulties[0];

  return {
    title: `${curDifficulty.name} Experts | BTD6 Maplist`,
    description: `A list of difficult community-made Bloons TD 6 maps. ${curDifficulty.meta_desc}`,
  };
}

export default async function Experts({ searchParams }) {
  const maplist = await getMaplist({ format: 51 });

  let difficulty = searchParams.difficulty || "casual";
  if (!difficulties.map(({ query }) => query).includes(difficulty))
    difficulty = "casual";

  let curDifficulty =
    difficulties.find(({ query }) => difficulty === query) || difficulties[0];

  return (
    <>
      <h1 className="text-center">Expert List</h1>

      <div>
        <DifficultySelector
          value={curDifficulty.value}
          difficulties={difficulties}
          href="/expert-list?difficulty={queryval}"
        />
        <p className={`${styles.diffDesc}`}>{curDifficulty.description}</p>
        <p className={`${styles.diffDesc}`}>
          Join the{" "}
          <a href={discordInvites.maplist} target="_blank">
            BTD6 Maplist Discord
          </a>{" "}
          if you would like to interact with the community more!
        </p>

        <SubmissionRules on={51} />

        <MapList
          maps={maplist.filter((map) => map.format_idx === curDifficulty.value)}
          completionFormats={[51, 1]}
          listFormat={51}
        />
      </div>
    </>
  );
}
