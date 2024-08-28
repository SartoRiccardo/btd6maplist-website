"use client";
import MapForm from "@/components/forms/MapForm";

export function MapForm_C({ code, initialValues }) {
  return (
    <MapForm
      code={code}
      initialValues={initialValues}
      submitText={"Save"}
      buttons={[
        {
          text: "Delete",
          variant: "danger",
          onClick: async (e) => {
            await new Promise((r) => setTimeout(r, 2000));
            console.log(e);
          },
        },
      ]}
    />
  );
}
