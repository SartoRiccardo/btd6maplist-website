import Btd6Map from "@/components/maps/Btd6Map";

export default function MapListLoader({ mapCount }) {
  mapCount = mapCount || 30;
  const maps = [];

  for (let i = 0; i < mapCount; i++)
    maps.push(
      <div key={i} className="col-6 col-lg-4">
        <Btd6Map placeholder />
      </div>
    );

  return <div className="row">{maps}</div>;
}
