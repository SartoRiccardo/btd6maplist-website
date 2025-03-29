import SelectorButton from "@/components/buttons/SelectorButton";
import FullCompletionInfoRow from "@/components/maps/FullCompletionInfoRow";
import { FullCompletionInfoRow_Plc } from "@/components/maps/FullCompletionInfoRow";
import UserEntry from "@/components/users/UserEntry";
import DiscordWidget from "@/components/utils/DiscordWidget";
import {
  getRecentCompletions,
  getVisibleFormats,
} from "@/server/maplistRequests";
import { allFormats } from "@/utils/maplistUtils";
import Link from "next/link";
import { Suspense } from "react";

export default async function Home() {
  return (
    <div className="text-center">
      <h1> Bloons TD 6 Maplist</h1>
      <div className="text-center fs-5 mb-3" data-cy="project-description">
        The BTD6 Maplist showcases a collection of challenging custom maps for
        Bloons TD 6, created by the community. These maps range from cleverly
        designed to incredibly difficult, offering a variety of experiences for
        players looking to test their tower defense skills.
        <div className="mt-3 fs-6">
          <a href={process.env.NEXT_PUBLIC_DISCORD_INVITE} target="_blank">
            Discord
          </a>
          {" | "}
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

      <h2 className="mt-5">Lists</h2>
      <p className="fs-5">
        There are 2 different lists, each divided into separate subcategories
        and leaderboards.
      </p>
      <div className="row justify-content-center mb-3 font-border">
        <div className="col-6 col-md-4 col-lg-3">
          <Link scroll={true} className="no-underline" href="/maplist">
            <div className="panel bg-list shadow pt-3 h-100 no-border">
              <div className="flex-hcenter mb-2">
                <div className="flex-vcenter">
                  <SelectorButton active>
                    <img
                      src="/format_icons/icon_allver.webp"
                      width={40}
                      height={40}
                    />
                  </SelectorButton>
                </div>
                <div className="flex-vcenter">
                  <h3 className="m-0 ms-2">The Maplist</h3>
                </div>
              </div>
              <p>
                Community-curated list of the 50 hardest maps, ranked from
                hardest to easiest. Beat them to gain points and climb the
                leaderboard!
              </p>
            </div>
          </Link>
        </div>
        <div className="col-6 col-md-4 col-lg-3">
          <Link scroll={true} className="no-underline" href="/expert-list">
            <div className="panel bg-experts shadow pt-3 h-100 no-border">
              <div className="flex-hcenter mb-2">
                <div className="flex-vcenter">
                  <SelectorButton active>
                    <img
                      src="/format_icons/icon_hard.webp"
                      width={40}
                      height={40}
                    />
                  </SelectorButton>
                </div>
                <div className="flex-vcenter">
                  <h3 className="m-0 ms-2">Expert List</h3>
                </div>
              </div>
              <p>
                Maps of varying difficulty, but none too easy, where more of the
                classic challenges and strategies are viable.
              </p>
            </div>
          </Link>
        </div>
      </div>

      <h2 className="mt-5">Recent Completions</h2>
      <Suspense fallback={<RecentCompletions_Plc count={5} />}>
        <RecentCompletions />
      </Suspense>

      <h2 className="mt-5">Join, Play and Create</h2>
      <div className="row d-flex justify-content-center align-items-center">
        <div className="col-12 col-md-5">
          <p className="text-start fs-5">
            Whether you're a map maker, someone who likes a challenge, or both,
            you can submit your own custom maps and run completions either
            through the Discord server's bot or this website (you don't need to
            make an account, you can log in with Discord). Either way you should{" "}
            <a href={process.env.NEXT_PUBLIC_DISCORD_INVITE} target="_blank">
              join the Discord server!
            </a>
          </p>
        </div>

        <div className="col-12 col-md-auto">
          <DiscordWidget />
        </div>
      </div>

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
