import SelectorButton from "@/components/buttons/SelectorButton";
import UserEntry from "@/components/users/UserEntry";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="text-center">
      <h1> Bloons TD 6 Maplist</h1>
      <div className="text-center lead mb-3">
        The BTD6 Maplist is a project started by
        <span className="d-inline-block mx-2">
          <UserEntry id="513869624157405186" centered={true} inline />
        </span>
        and
        <span className="d-inline-block mx-2">
          <UserEntry id="300761010569216001" centered={true} inline />
        </span>
        in order to categorize and rank the hardest maps in the game because of
        the advent of the map editor.
        <div className="mt-3">
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

      <h2>Formats</h2>
      <p>
        There are 2 different lists, each divided into separate subcategories
        and leaderboards.
      </p>
      <div className="row justify-content-center mb-3 font-border">
        <div className="col-6 col-md-4 col-lg-3">
          <Link className="no-underline" href="/list" scroll={false}>
            <div className="panel bg-list shadow pt-3 h-100">
              <div className="flex-hcenter mb-2">
                <div className="flex-vcenter">
                  <SelectorButton active>
                    <img src="/icon_allver.png" width={40} height={40} />
                  </SelectorButton>
                </div>
                <div className="flex-vcenter">
                  <h3 className="m-0 ms-2">The Maplist</h3>
                </div>
              </div>
              <p>
                Community-curated list of 50 maps, ranked from hardest to
                easiest. Beat them to gain points and climb the leaderboard!
              </p>
            </div>
          </Link>
        </div>
        <div className="col-6 col-md-4 col-lg-3">
          <Link className="no-underline" href="/experts" scroll={false}>
            <div className="panel bg-experts shadow pt-3 h-100">
              <div className="flex-hcenter mb-2">
                <div className="flex-vcenter">
                  <SelectorButton active>
                    <img src="/icon_hard.png" width={40} height={40} />
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

      <h2>Join, Play and Create</h2>
      <p className="text-start">
        Whether you're a map maker, someone who likes a challenge, or both, you
        can submit your own custom maps and run completions either through the
        Discord server's bot or this website (you don't need to make an account,
        you can log in with Discord). Either way you should{" "}
        <a href={process.env.NEXT_PUBLIC_DISCORD_INVITE} target="_blank">
          join the Discord server!
        </a>
      </p>

      <hr />

      <div className="text-start">
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
