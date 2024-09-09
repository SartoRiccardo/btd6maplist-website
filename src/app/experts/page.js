import styles from "./maplist.module.css";
import Btd6Map from "@/components/maps/Btd6Map";
import DifficultySelector from "@/components/maps/DifficultySelector";
import { difficulties } from "@/utils/maplistUtils";
import { getExpertMaplist } from "@/server/maplistRequests";
import AddMapListEntry from "@/components/layout/maplists/AddMapListEntry";
import SubmissionRules from "@/components/layout/maplists/SubmissionRules";

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
  const maplist = await getExpertMaplist();

  let difficulty = searchParams.difficulty || "casual";
  if (!difficulties.map(({ query }) => query).includes(difficulty))
    difficulty = "casual";

  let curDifficulty =
    difficulties.find(({ query }) => difficulty === query) || difficulties[0];

  return (
    <>
      <title>{}</title>

      <h1 className="text-center">Expert Maplist</h1>

      <div>
        <DifficultySelector
          value={curDifficulty.value}
          difficulties={difficulties}
          href="/experts?difficulty={queryval}"
        />
        <p className={`${styles.diffDesc}`}>{curDifficulty.description}</p>

        <SubmissionRules on="experts" />

        <div className="row">
          <AddMapListEntry on="experts" />

          {maplist
            .filter((map) => map.difficulty === curDifficulty.value)
            .map((map) => (
              <div key={map.code} className="col-12 col-sm-6 col-lg-4">
                <Btd6Map mapData={map} name={map.name} hrefBase="/map" />
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
