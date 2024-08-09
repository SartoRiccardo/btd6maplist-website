import ExpertMaplist from "@/components/layout/maplists/ExpertMaplist";
import { getExpertMaplist } from "@/server/maplistRequests";

export default async function Experts() {
  const maplist = await getExpertMaplist();
  return (
    <>
      <h1 className="text-center">Expert Maplist</h1>
      <ExpertMaplist maplist={maplist} />
    </>
  );
}
