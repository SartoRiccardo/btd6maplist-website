import SubmitRunForm from "@/components/forms/SubmitRunForm";
import { getMap } from "@/server/maplistRequests";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Submit Run | BTD6 Maplist",
};

export default async function SubmitRun({ params }) {
  const { code } = params;
  const mapData = await getMap(code);
  if (mapData === null) notFound();

  return (
    <>
      <h1 className="text-center mb-2">Submit Run</h1>
      <p className="lead text-center">{mapData.name}</p>

      <SubmitRunForm mapData={mapData} />
    </>
  );
}
