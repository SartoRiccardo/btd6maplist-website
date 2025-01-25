import FormEditRoles from "@/components/forms/FormEditRoles";
import { getAchievementRoles } from "@/server/maplistRequests";
import { getDiscordUserGuilds } from "@/server/discordRequests";
import { getAccessToken } from "@/utils/cookie-utils";

export default async function RolesPage() {
  const roles = await getAchievementRoles();
  const accessToken = getAccessToken();
  const userGuilds = await getDiscordUserGuilds(accessToken);

  return (
    <>
      <h1 className="text-center">Roles</h1>

      <div className="panel panel-container">
        <FormEditRoles roles={roles} guilds={userGuilds} />
      </div>
    </>
  );
}
