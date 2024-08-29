import { getMap } from "@/server/maplistRequests";
import { MapFormEdit_C } from "./page.client";
import { mapDataToFormik } from "@/utils/maplistUtils";

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

      <MapFormEdit_C code={code} initialValues={initialValues} />
    </>
  );
}
