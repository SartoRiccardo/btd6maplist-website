"use client";
import MapForm from "@/components/forms/MapForm";
import { editMap, deleteMap } from "@/server/maplistRequests.client";
import { revalidateMap } from "@/server/revalidations";

export const MapFormEdit_C = ({ code, initialValues }) => (
  <MapForm
    code={code}
    initialValues={initialValues}
    onEdit={editMap}
    onDelete={async () => {
      await deleteMap(code);
      revalidateMap(code).then(() => router.push("/list"));
    }}
  />
);
