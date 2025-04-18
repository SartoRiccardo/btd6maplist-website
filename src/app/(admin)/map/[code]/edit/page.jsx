import { getMap } from "@/server/maplistRequests";
import { mapDataToFormik } from "@/utils/maplistUtils";
import FormMap from "@/components/forms/FormMap";
import FormTransferCompletion from "@/components/forms/FormTransferCompletions";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Map | BTD6 Maplist",
};

export default async function AddMap({ params }) {
  const { code } = params;
  const mapData = await getMap(code);

  if (mapData === null) notFound();

  const initialValues = mapDataToFormik(mapData);
  const isDeleted = mapData.deleted_on !== null;

  return (
    <>
      <h1 className="text-center">Edit Map - {code}</h1>

      <FormMap
        code={code}
        initialValues={initialValues}
        isDeleted={isDeleted}
      />

      {isDeleted && <FormTransferCompletion from={mapData.code} />}
    </>
  );
}
