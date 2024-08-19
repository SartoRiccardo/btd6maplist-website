import styles from "../experts/maplist.module.css";
import TheList from "@/components/layout/maplists/TheList";
import DifficultySelector from "@/components/maps/DifficultySelector";
import { getTheList } from "@/server/maplistRequests";
import { listVersions } from "@/utils/maplistUtils";

export const metadata = {
  title: "The List | BTD6 Maplist",
};

export default async function TheListPage({ searchParams }) {
  let version = searchParams?.format || "current";
  if (!listVersions.map(({ query }) => query).includes(version)) {
    version = "current";
  }

  let curFormat =
    listVersions.find(({ query }) => version === query) || listVersions[0];
  const maps = await getTheList(version);

  return (
    <>
      <title>
        {`The List ${version === "all" ? "(all versions)" : ""} | BTD6 Maplist`}
      </title>

      <h1 className="text-center">The List</h1>

      <DifficultySelector
        value={curFormat.value}
        difficulties={listVersions}
        href="/list?format={queryval}"
      />
      <p className={`${styles.diffDesc}`}>{version.description}</p>

      <TheList maps={maps} format={curFormat.value} />
    </>
  );
}
