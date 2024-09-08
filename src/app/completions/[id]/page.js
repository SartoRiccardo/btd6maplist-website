import { getCompletion } from "@/server/maplistRequests";
import EditCompletion_C from "./page.client";

export const metadata = {
  title: "Edit Completion | BTD6 Maplist",
};

export default async function EditCompletion({ params }) {
  const { id } = params;
  const completion = await getCompletion(id);

  return (
    <>
      <h1 className="text-center">Edit Completion</h1>

      <EditCompletion_C completion={completion} />
    </>
  );
}
