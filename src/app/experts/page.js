import ExpertMaplist from "@/components/layout/maplists/ExpertMaplist";
import { getExpertMaplist } from "@/server/maplistRequests";

export default async function Experts() {
  const maplist = await getExpertMaplist();
  return <ExpertMaplist maplist={maplist} />;
}
