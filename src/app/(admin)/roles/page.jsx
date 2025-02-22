import FormEditRoles from "@/components/forms/FormEditRoles";
import { getAchievementRoles } from "@/server/maplistRequests";

export default async function RolesPage() {
  const roles = await getAchievementRoles();

  return (
    <>
      <h1 className="text-center">Roles</h1>

      <FormEditRoles roles={roles} />
    </>
  );
}
