import { getMap } from "@/server/maplistRequests";
import { getCustomMap } from "@/server/ninjakiwiRequests";

export default async function ExpertMap({ params }) {
  const { code } = params;
  const [maplistData, btd6Data] = await Promise.all([
    getMap(code),
    getCustomMap(code),
  ]);

  return (
    <>
      <h1 className="text-center">Expert Maplist</h1>
    </>
  );
}
