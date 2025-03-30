import FormSubmitMap from "@/components/forms/FormSubmitMap";

export default async function SubmitMap({ searchParams }) {
  return (
    <>
      <h1 className="text-center">Submit a Map</h1>

      <FormSubmitMap type={searchParams.on} remakeOf={searchParams.remake_of} />
    </>
  );
}
