"use client";
import {
  useAuthLevels,
  useDiscordToken,
  useMaplistProfile,
  useMaplistRoles,
} from "@/utils/hooks";
import styles from "./userpage.module.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { serverRoleStyles } from "@/utils/maplistUtils";
import {
  addRoleToUser,
  removeRoleFromUser,
} from "@/server/maplistRequests.client";
import { useState } from "react";
import ErrorToast from "@/components/forms/ErrorToast";
import { revalidateUser } from "@/server/revalidations";

export function UserRole({
  name,
  color,
  borderColor,
  description,
  removable,
  onRemove,
}) {
  const component = (
    <div
      style={{ backgroundColor: color, borderColor }}
      className={`font-border ${styles.role}`}
    >
      {removable && onRemove && (
        <i
          className="bi bi-x-lg c-pointer pe-2"
          onClick={onRemove}
          tabIndex={0}
        />
      )}
      {name}
    </div>
  );

  return description ? (
    <OverlayTrigger
      overlay={(props) => (
        <Tooltip {...props} id={`usrrole-${name.replace(" ", "-")}`}>
          {description}
        </Tooltip>
      )}
    >
      {component}
    </OverlayTrigger>
  ) : (
    component
  );
}

export function WebsiteCreatorRole() {
  return (
    <OverlayTrigger
      overlay={(props) => (
        <Tooltip {...props} id="usrrole-website-creator">
          Coded this website!
        </Tooltip>
      )}
    >
      <div className={`font-border ${styles.rainbow} ${styles.role}`}>
        <a href="https://github.com/SartoRiccardo/" target="_blank">
          Website Creator <i className="bi bi-box-arrow-up-right ms-1" />
        </a>
      </div>
    </OverlayTrigger>
  );
}

export function ServerRoles({ userId, roles }) {
  const [errors, setErrors] = useState({});
  const [pendingChanges, setPendingChanges] = useState([]);
  const { maplistProfile } = useMaplistProfile();
  const token = useDiscordToken();
  const { hasPerms } = useAuthLevels();
  const maplistRoles = useMaplistRoles();

  const addRole = async (roleId) => {
    setPendingChanges([
      ...pendingChanges.filter((p) => p.id !== roleId),
      { id: roleId, action: "POST" },
    ]);
    const response = await addRoleToUser(token.access_token, userId, roleId);
    if (response?.errors) {
      setErrors(response.errors);
      setPendingChanges(pendingChanges.filter((p) => p.id !== roleId));
    } else {
      revalidateUser(userId);
    }
  };

  const removeRole = async (roleId) => {
    setPendingChanges([
      ...pendingChanges.filter((p) => p.id !== roleId),
      { id: roleId, action: "DELETE" },
    ]);
    const response = await removeRoleFromUser(
      token.access_token,
      userId,
      roleId
    );
    if (response?.errors) {
      setErrors(response.errors);
      setPendingChanges(pendingChanges.filter((p) => p.id !== roleId));
    } else {
      revalidateUser(userId);
    }
  };

  // Pending changes
  const pendingRolesToRemove = new Set(
    pendingChanges.filter(({ action }) => action === "DELETE").map((r) => r.id)
  );
  let hasRoleIds = new Set(roles.map((r) => r.id));
  const pendingRolesToAdd = pendingChanges.filter(
    (p) => !hasRoleIds.has(p.id) && p.action === "POST"
  );
  const renderRoles = new Set(
    [
      ...roles.filter((r) => !pendingRolesToRemove.has(r.id)),
      ...pendingRolesToAdd.map((rAdd) =>
        maplistRoles.find((rMl) => rMl.id === rAdd.id)
      ),
    ].sort((a, b) => a.id - b.id)
  );

  hasRoleIds = new Set();
  for (const { id } of renderRoles) hasRoleIds.add(id);

  // Rendering
  const grantableIds = new Set();
  const removableRoles = new Set();
  if (maplistProfile?.roles) {
    for (const role of maplistProfile.roles) {
      const mlRole = maplistRoles.find((mlRole) => mlRole.id === role.id);
      if (!mlRole) continue;
      for (const grant of mlRole.can_grant) {
        if (!hasRoleIds.has(grant)) grantableIds.add(grant);
        else removableRoles.add(grant);
      }
    }
  }
  const grantableRoles = [];
  for (const roleId of grantableIds) {
    grantableRoles.push(maplistRoles.find(({ id }) => id === roleId));
  }

  const roleComponents = [];
  for (const { id, name } of renderRoles) {
    const roleStyles = serverRoleStyles[id];
    if (!roleStyles || (roleStyles?.hidden && !hasPerms)) continue;

    roleComponents.push(
      <UserRole
        key={id}
        name={name}
        color={roleStyles.bg}
        borderColor={roleStyles.border}
        removable={removableRoles.has(id)}
        onRemove={() => removeRole(id)}
      />
    );
  }

  return (
    <>
      {roleComponents}

      {grantableRoles.length > 0 && (
        <div className={`p-relative ${styles.btn_add_roles_wrapper}`}>
          <div
            className={`font-border ${styles.role} ${styles.btn_add_roles}`}
            tabIndex={0}
          >
            <i className="bi bi-plus-lg" />
          </div>

          <ul className={styles.roles_dropdown}>
            {grantableRoles.map(({ id, name }) => (
              <li
                key={id}
                className="font-border"
                tabIndex={0}
                onClick={() => addRole(id)}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <ErrorToast errors={errors} setErrors={setErrors} />
    </>
  );
}
