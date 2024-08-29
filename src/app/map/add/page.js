import MapForm from "@/components/forms/MapForm";

export const metadata = {
  title: "Add Map | BTD6 Maplist",
};

export default async function AddMap() {
  return (
    <>
      <h1 className="text-center">Add Map</h1>
      <MapForm />
    </>
  );
}
