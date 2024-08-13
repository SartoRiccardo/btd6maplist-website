import Btd6Map from "@/components/maps/Btd6Map";
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
        <div className="col-12 col-md-6 col-lg-5">
          <Btd6Map
            code={code}
            playBtn
            otherCodes={mapData.additional_codes}
            verified={mapData.verified}
          />
        </div>
        <div className="col"></div>
      </div>
    </>
  );
}
