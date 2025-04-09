import Btd6Map from "@/components/maps/Btd6Map";
import cssHome from "./Home.module.css";
import SelectorButton from "@/components/buttons/SelectorButton";
import FullCompletionInfoRow from "@/components/maps/FullCompletionInfoRow";
import { FullCompletionInfoRow_Plc } from "@/components/maps/FullCompletionInfoRow";
import UserEntry from "@/components/users/UserEntry";
import DiscordWidget from "@/components/utils/DiscordWidget";
import {
  getFormats,
  getRecentCompletions,
  getVisibleFormats,
} from "@/server/maplistRequests";
import { allFormats } from "@/utils/maplistUtils";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import Medal from "@/components/ui/Medal";

export default async function Home() {
  const formats = await getFormats();
  const visibleFormats = formats
    .filter(({ hidden }) => !hidden)
    .map(({ id }) => id);

  return (
    <div className="text-center">
      <h1> Bloons TD 6 Maplist</h1>
      <div className="text-center fs-5 mb-3" data-cy="project-description">
        The BTD6 Maplist showcases a collection of challenging custom maps for
        Bloons TD 6, created by the community. These maps range from cleverly
        designed to incredibly difficult, offering a variety of experiences for
        players looking to test their tower defense skills.
        <div className="mt-3 fs-6">
          <a href="https://www.youtube.com/@btd6maplist" target="_blank">
            YouTube
          </a>
          {" | "}
          <a
            href="https://github.com/stars/SartoRiccardo/lists/btd6-maplist"
            target="blank"
          >
            GitHub
          </a>
        </div>
      </div>

      <div className={`${cssHome.home_formats} mt-5 mt-md-0`}>
        {visibleFormats.includes(1) && (
          <div className="row gy-4 py-4">
            <div className="col-12 col-md-6 p-relative order-last">
              <Image
                src="/format_icons/hero_maplist.png"
                alt=""
                width={350}
                height={350}
              />
              <div className={cssHome.map_preview_container}>
                <Btd6Map code="ZFKTKEH" />
                <Btd6Map code="ZMOFEYB" />
                <Btd6Map code="ZFFEETW" />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <h2>
                <Medal
                  src="/format_icons/icon_curver.webp"
                  border
                  className="mb-2"
                />{" "}
                The Maplist
              </h2>
              <p>
                This is where you go to suffer — but in a fun way. The community
                curates this list of the 50 hardest custom maps, ranked from
                hardest to easiest. Beat them to earn points, climb the
                leaderboard, and flex on your friends. New maps rotate in to
                keep the pain fresh.
              </p>
              <div className="pt-2">
                <Link href="/maplist">
                  <button className="btn btn-primary">
                    Check out the Maplist
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {visibleFormats.includes(51) && (
          <div className="row py-4 gy-4">
            <div className="col-12 col-md-6 p-relative order-last order-md-first">
              <Image
                src="/format_icons/hero_expert_list.png"
                alt=""
                width={350}
                height={350}
              />
              <div className={cssHome.map_preview_container}>
                <Btd6Map code="ZFFBGCC" />
                <Btd6Map code="ZMOFEYB" />
                <Btd6Map code="ZFFTBHX" />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <h2>
                <Medal
                  src="/format_icons/icon_hard.webp"
                  border
                  className="mb-2"
                />{" "}
                The Expert List
              </h2>
              <p>
                This collection features thoughtfully designed maps where
                gameplay and decoration matters more than raw difficulty. You
                can attempt some of the classic challenges in these maps, such
                as 2 Million Pops CHIMPS or 2 Towers CHIMPS. It's the perfect
                middle ground - challenging enough to feel rewarding, but fair
                enough to stay fun.
              </p>
              <div className="pt-2">
                <Link href="/expert-list">
                  <button className="btn btn-primary">
                    Check out the Expert List
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {visibleFormats.includes(52) && (
          <div className="row py-4 gy-4">
            <div className="col-12 col-md-6 p-relative order-last">
              <Image
                src="/format_icons/hero_best_of_the_best.png"
                alt=""
                width={350}
                height={350}
              />
              <div className={cssHome.map_preview_container}>
                <Btd6Map code="ZFGGFRV" />
                <Btd6Map code="ZFMWKKL" />
                <Btd6Map code="ZFFPRCS" />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <h2>
                <Medal
                  src="/format_icons/icon_botb.png"
                  border
                  className="mb-2"
                />{" "}
                Best of the Best
              </h2>
              <p>
                Some custom maps are so good they feel like NK made them. This
                pack is all about gorgeous visuals and high-quality gameplay —
                no jank, just pure eye candy. Perfect when you want a challenge
                that also looks amazing. Be careful, it doesn't mean every map
                here is easy!
              </p>
              <div className="pt-2">
                <Link href="/best-of-the-best">
                  <button className="btn btn-primary">
                    Browse the Best of the Best
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {visibleFormats.includes(11) && (
          <div className="row py-4 gy-4">
            <div className="col-12 col-md-6 p-relative order-last order-md-first">
              <Image
                src="/format_icons/hero_nostalgia_pack.png"
                alt=""
                width={350}
                height={350}
              />
              <div className={cssHome.map_preview_container}>
                <Btd6Map code="ZMOPRVY" />
                <Btd6Map code="ZFMXPDS" />
                <Btd6Map code="ZFMKRDL" />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <h2>
                <Medal
                  src="/format_icons/icon_np_1.png"
                  border
                  className="mb-2"
                />{" "}
                Nostalgia Pack
              </h2>
              <p>
                Miss the old days? These are classic maps from BTD5 and BMC, but
                rebuilt for BTD6. You can finally bring havoc into these old
                maps by getting heros and paragons. Time to relive the glory
                days (and finally beat that one map that haunted you).
              </p>
              <div className="pt-2">
                <Link href="/nostalgia-pack">
                  <button className="btn btn-primary">
                    Revisit the Nostalgia Pack
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <h2 className="mt-5">Recent Completions</h2>
      <Suspense fallback={<RecentCompletions_Plc count={5} />}>
        <RecentCompletions />
      </Suspense>

      <hr className="my-5" />

      <div className="text-start" data-cy="project-credits">
        <p>Special thanks to:</p>
        <ul>
          <li>
            The Geometry Dash Demon List, which was the primary inspiration
            behind this project, as well as smaller projects like the 2 Player
            List and Insane Demon List.
          </li>
          <li className="my-2">
            <span className="d-inline-block me-2">
              <UserEntry id="508409944736006154" centered={true} inline />
            </span>
            for helping to set up the Discord server and designing the project's
            icon
          </li>
          <li>
            <span className="d-inline-block me-2">
              <UserEntry id="1077309729942024302" centered={true} inline />
            </span>
            for making and hosting both the website and the Discord bot
          </li>
        </ul>
      </div>
    </div>
  );
}

async function RecentCompletions() {
  const visibleFormats = await getVisibleFormats();
  const formats = allFormats
    .filter(({ value }) => visibleFormats.includes(value))
    .map(({ value }) => value.toString())
    .join(",");
  const completions = await getRecentCompletions({ formats });

  return completions.map((cmp) => (
    <FullCompletionInfoRow key={cmp.id} completion={cmp} />
  ));
}

function RecentCompletions_Plc({ count }) {
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push(<FullCompletionInfoRow_Plc key={i} />);
  }
  return items;
}
