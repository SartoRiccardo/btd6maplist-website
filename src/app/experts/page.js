import ExpertMaplist from "@/components/layout/maplists/ExpertMaplist";
import { getExpertMaplist } from "@/server/maplistRequests";

export const metadata = {
  title: "BTD6 Expert Maplist",
  description: "A community curated list of the best Bloons TD 6 custom maps",
};

export default async function Experts() {
  const maplist = await getExpertMaplist();
  return (
    <>
      <h1 className="text-center">Expert Maplist</h1>
      <ExpertMaplist maplist={maplist} />
    </>
  );
}
