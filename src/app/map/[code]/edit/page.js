import { getMap } from "@/server/maplistRequests";
import { mapDataToFormik } from "@/utils/maplistUtils";
import MapForm from "@/components/forms/MapForm";

export const metadata = {
  title: "Edit Map | BTD6 Maplist",
};

export default async function AddMap({ params }) {
  const { code } = params;
  const mapData = await getMap(code);

  if (!mapData) return <ResourceNotFound label="map" />;

  const initialValues = mapDataToFormik(mapData);

  return (
    <>
      <h1 className="text-center">Edit Map - {code}</h1>

      <MapForm code={code} initialValues={initialValues} />
    </>
  );
}