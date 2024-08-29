"use client";
import MapForm from "@/components/forms/MapForm";
import { editMap, deleteMap } from "@/server/maplistRequests.client";
import { revalidateMap } from "@/server/revalidations";
import { useRouter } from "next/navigation";

export function MapFormEdit_C({ code, initialValues }) {
  const router = useRouter();

  return (
    <MapForm
      code={code}
      initialValues={initialValues}
      submitText={"Save"}
      onSubmit={editMap}
      buttons={[
        {
          text: "Delete",
          variant: "danger",
          onClick: async () => {
            await deleteMap(code);
            revalidateMap(code).then(() => router.push("/list"));
          },
        },
      ]}
    />
  );
}
