import EditRunForm from "@/components/forms/EditRunForm";
import { getCompletion } from "@/server/maplistRequests";

export const metadata = {
  title: "Edit Completion | BTD6 Maplist",
};

export default async function EditCompletion({ params }) {
  const { id } = params;
  const completion = await getCompletion(id);
  console.log(completion);

  return (
    <>
      <h1 className="text-center">Edit Completion</h1>

      <EditRunForm completion={completion} />
    </>
  );
}
