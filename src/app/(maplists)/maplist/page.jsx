import styles from "../maplist.module.css";
import SubmissionRules from "@/components/layout/maplists/SubmissionRules";
import MapList from "@/components/layout/maplists/MapList";
import DifficultySelector from "@/components/maps/DifficultySelector";
import { getMaplist, getVisibleFormats } from "@/server/maplistRequests";
import { discordInvites, listVersions } from "@/utils/maplistUtils";

export async function generateMetatdata({ searchParams }) {
  let version = searchParams?.format || "current";
  if (!listVersions.map(({ query }) => query).includes(version))
    version = "current";

  return {
    title: `The List ${
      version === "all" ? "(all versions)" : ""
    } | BTD6 Maplist`,
    description:
      "50 of the hardest community-made Bloons TD 6 maps, ranked by difficulty. Each one awards points on completion",
  };
}

export default async function TheListPage({ searchParams }) {
  let version = searchParams?.format || "current";
  if (!listVersions.map(({ query }) => query).includes(version))
    version = "current";

  let curFormat =
    listVersions.find(({ query }) => version === query) || listVersions[0];
  const [maps, visibleFormats] = await Promise.all([
    getMaplist({ format: curFormat.value }),
    getVisibleFormats(),
  ]);

  return (
    <>
      <h1 className="text-center">The Maplist</h1>

      <DifficultySelector
        value={curFormat.value}
        difficulties={listVersions.filter(({ value }) =>
          visibleFormats.includes(value)
        )}
        href="/maplist?format={queryval}"
      />
      <p className={`${styles.diffDesc}`}>{curFormat.description}</p>
      <p className={`${styles.diffDesc}`}>
        Join the{" "}
        <a href={discordInvites.maplist} target="_blank">
          BTD6 Maplist Discord
        </a>{" "}
        if you would like to interact with the community more!
      </p>

      <SubmissionRules on={1} />

      <MapList
        maps={maps}
        completionFormats={[1, curFormat.value]}
        showPlacement
      />
    </>
  );
}
