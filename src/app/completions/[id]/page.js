import { getCompletion } from "@/server/maplistRequests";
import EditCompletion_C from "./page.client";
import Link from "next/link";
import ResourceNotFound from "@/components/layout/ResourceNotFound";

export const metadata = {
  title: "Edit Completion | BTD6 Maplist",
};

export default async function EditCompletion({ params }) {
  const { id } = params;
  const completion = await getCompletion(id);

  if (!completion) return <ResourceNotFound label="completion" />;

  return (
    <>
      <h1 className="text-center mb-1">Edit Completion</h1>
      <p className="text-center muted mb-4">
        Map: <Link href={`/map/${completion.map}`}>{completion.map}</Link>
      </p>

      <EditCompletion_C completion={completion} />
    </>
  );
}
