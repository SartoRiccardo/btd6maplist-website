import NewCompletion_C from "./page.client";
import Link from "next/link";

export const metadata = {
  title: "New Completion | BTD6 Maplist",
};

export default async function NewCompletion({ params }) {
  const { code } = params;

  return (
    <>
      <h1 className="text-center mb-1">New Completion</h1>
      <p className="text-center muted mb-4">
        Map: <Link href={`/map/${code}`}>{code}</Link>
        <br />
        The user you want to give the completion to must be present in the
        Maplist Database.
      </p>

      <NewCompletion_C code={code} />
    </>
  );
}
