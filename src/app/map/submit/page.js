import SubmitMapForm from "@/components/forms/SubmitMapForm";

export default async function SubmitMap({ searchParams }) {
  return (
    <>
      <h1 className="text-center">Submit a Map</h1>

      <SubmitMapForm type={searchParams.on} />
    </>
  );
}
