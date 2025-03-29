import ConfigPageClient from "./page.client";

export const metadata = {
  title: "Admin Configuration | BTD6 Maplist",
};

export default async function ConfigVarPage() {
  return (
    <>
      <h1 className="text-center">List Configuration</h1>
      <ConfigPageClient />
    </>
  );
}
