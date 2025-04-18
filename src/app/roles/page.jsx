import FormEditRoles from "@/components/forms/FormEditRoles";
import { getAchievementRoles } from "@/server/maplistRequests";

export default async function RolesPage() {
  const roles = await getAchievementRoles();

  return (
    <>
      <h1 className="text-center">Roles</h1>

      <p className="text-center muted">
        Struggling with colors? You can use an external website for them. I
        always use{" "}
        <a href="https://materializecss.com/color.html" target="_blank">
          Materialize CSS's color palettes!
        </a>
      </p>
      <FormEditRoles roles={roles} />
    </>
  );
}
