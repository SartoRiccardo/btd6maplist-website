"use client";
import MapForm from "@/components/forms/MapForm";
import { addMap, editMap, deleteMap } from "@/server/maplistRequests.client";
import { revalidateMap } from "@/server/revalidations";
import { useRouter } from "next/navigation";

export function MapFormAdd_C({ code, initialValues }) {
  const router = useRouter();

  return (
    <MapForm
      code={code}
      initialValues={initialValues}
      onAdd={addMap}
      onEdit={editMap}
      onDelete={async () => {
        await deleteMap(code);
        revalidateMap(code).then(() => router.push("/list"));
      }}
    />
  );
}
