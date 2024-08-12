import MapPlacements from "@/components/maps/MapPlacements";
import { getMap } from "@/server/maplistRequests";

export default async function ExpertMap({ params }) {
  const { code } = params;
  const mapData = await getMap(code);

  return (
    <>
      <h1 className="text-center mb-2">{mapData.name}</h1>
      <p className="text-center lead">
        Code: <u>{mapData.code}</u>
      </p>
      <div className="row justify-content-center">
        <MapPlacements mapData={mapData} />
      </div>
      <div className="row">
        {/* Map preview */}
        <div className="col"></div>
        <div className="col"></div>
      </div>
    </>
  );
}
