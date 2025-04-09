import styles from "../maplist.module.css";
import cssLeaderboard from "@/app/(visitor)/leaderboard/leaderboard.module.css";
import DifficultySelector from "@/components/maps/DifficultySelector";
import { discordInvites, npDifficulties } from "@/utils/maplistUtils";
import { getMaplist } from "@/server/maplistRequests";
import SubmissionRules from "@/components/layout/maplists/SubmissionRules";
import NostalgiaPackList from "@/components/layout/maplists/NostalgiaPackList";
import Link from "next/link";

export async function generateMetadata({ searchParams }) {
  let game = searchParams.game || npDifficulties[0].query;
  if (!npDifficulties.map(({ query }) => query).includes(game))
    game = npDifficulties[0].query;

  let curDifficulty =
    npDifficulties.find(({ query }) => game === query) || npDifficulties[0];

  return {
    title: `${curDifficulty.name} Retro Maps | BTD6 Maplist`,
    description: `A list of difficult community-made Bloons TD 6 maps. ${curDifficulty.meta_desc}`,
  };
}

export default async function NostalgiaPackPage({ searchParams }) {
  let game = searchParams.game || npDifficulties[0].query;
  if (!npDifficulties.map(({ query }) => query).includes(game))
    game = npDifficulties[0].query;

  let curDifficulty =
    npDifficulties.find(({ query }) => game === query) || npDifficulties[0];

  const maplist = await getMaplist({ format: 11, filter: curDifficulty.value });

  let remade = 0;
  const maplistByCategory = {};
  const categories = [];
  for (const map of maplist) {
    if (map.code !== null) remade += 1;

    const categoryId = map.format_idx.category.name
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, "_");
    if (!(categoryId in maplistByCategory)) {
      maplistByCategory[categoryId] = [];
      categories.push({
        ...map.format_idx.category,
        categoryQuery: categoryId,
      });
    }
    maplistByCategory[categoryId].push(map);
  }

  return (
    <>
      <h1 className="text-center">Nostalgia Pack</h1>

      <div>
        <DifficultySelector
          value={curDifficulty.value}
          difficulties={npDifficulties}
          href={
            "/nostalgia-pack?" +
            new URLSearchParams({
              game: "{queryval}",
            }).toString()
          }
        />
        <p className={styles.diffDesc}>{curDifficulty.description}</p>
        <p className={styles.diffDesc}>
          Join the{" "}
          <a href={discordInvites.emporium} target="_blank">
            BTD6 Map Emporium
          </a>{" "}
          if you would like to interact with the community more!
        </p>
        <div className="mb-4">
          <p className="lead text-center">
            {((remade / maplist.length) * 100).toFixed(1)}% Complete ({remade}/
            {maplist.length})
          </p>
          <div className="px-5">
            <progress max={maplist.length} value={remade} />
          </div>
        </div>

        {categories.length > 1 && (
          <div
            className={`d-flex justify-content-center ${cssLeaderboard.lbValueChooser}`}
          >
            {categories
              .sort((a, b) => a.id - b.id)
              .map(({ name, id, categoryQuery }) => {
                const isActive = categoryQuery === searchParams?.category;

                return isActive ? (
                  <button
                    className="btn btn-primary active"
                    key={id}
                    data-cy="btn-category"
                  >
                    {name}
                  </button>
                ) : (
                  <Link
                    key={id}
                    scroll={false}
                    href={
                      "/nostalgia-pack?" +
                      new URLSearchParams({
                        ...searchParams,
                        category: categoryQuery,
                      }).toString()
                    }
                    className={`${
                      isActive ? cssLeaderboard.lbValueActive : ""
                    } font-border`}
                  >
                    <button className="btn btn-primary" data-cy="btn-category">
                      {name}
                    </button>
                  </Link>
                );
              })}
          </div>
        )}

        <SubmissionRules on={11} />

        {maplist.length > 0 && (
          <NostalgiaPackList
            key={searchParams?.category || categories[0].name}
            maps={
              maplistByCategory[
                searchParams?.category || categories[0].categoryQuery
              ]
            }
            completionFormats={[51, 1, 52, 11]}
            listFormat={11}
          />
        )}
      </div>
    </>
  );
}
