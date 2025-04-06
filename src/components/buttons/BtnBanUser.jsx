"use client";
import { selectMaplistProfile } from "@/features/authSlice";
import { useAppSelector } from "@/lib/store";
import { useDiscordToken, useHasPerms, useMaplistRoles } from "@/utils/hooks";
import LazyModal from "../transitions/LazyModal";
import { useCallback, useState } from "react";
import ToastSuccess from "../forms/ToastSuccess";
import { banUser, unbanUser } from "@/server/maplistRequests.client";
import { revalidateUser } from "@/server/revalidations";

export default function BtnBanUser({ user, roles }) {
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(0);
  const { maplistProfile } = useAppSelector(selectMaplistProfile);
  const hasPerms = useHasPerms();
  const maplistRoles = useMaplistRoles();
  const discordToken = useDiscordToken();
  const hasRoleIds = maplistProfile.roles.map(({ id }) => id);

  const handleBanUser = useCallback(async () => {
    const banFunc = user.is_banned ? unbanUser : banUser;
    if (banFunc(discordToken.access_token, user.id)) {
      setSuccess(user.is_banned ? "unbanned" : "banned");
      setShowModal(false);
      revalidateUser(user.id);
    }
  }, [user.id, user.is_banned, discordToken?.access_token]);

  let assignableRoles = [];
  for (const { id, can_grant } of maplistRoles) {
    if (hasRoleIds.includes(id)) {
      assignableRoles = assignableRoles.concat(can_grant);
    }
  }

  if (
    !maplistProfile ||
    maplistProfile.id === user.id ||
    !hasPerms("ban:user") ||
    !roles.every(({ id }) => assignableRoles.includes(id))
  )
    return null;

  return (
    <>
      <i
        className={`bi ${
          user.is_banned ? "bi-arrow-clockwise" : "bi-ban"
        } c-pointer a`}
        onClick={() => setShowModal(true)}
      />

      <LazyModal
        show={showModal}
        onHide={() => setShowModal(true)}
        className="modal-panel"
      >
        <div className="modal-content">
          <div className="modal-body">
            {user.is_banned ? (
              <p>
                Unban <b>{user.name}?</b>
              </p>
            ) : (
              <p>
                Are you sure you want to <u>delete</u> <b>{user.name}</b>?
                <br />
                <span className="muted">
                  They will have all their permissions stripped and won't be
                  able to change their profile. You can unban them anytime.
                </span>
                <br />
                <br />
                <span className="text-danger">
                  This should be reserved for serious cases.
                </span>{" "}
                If you just want to stop someone from submitting, please remove
                the "Can Submit" role instead.
              </p>
            )}
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-primary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className={`btn ${
                  user.is_banned ? "btn-success" : "btn-danger"
                } big`}
                onClick={handleBanUser}
                data-cy="btn-delete-submission-confirm"
              >
                {user.is_banned ? "Unban" : "Ban"}
              </button>
            </div>
          </div>
        </div>
      </LazyModal>

      <ToastSuccess show={success} onClose={() => setSuccess(false)}>
        User was {success}!
      </ToastSuccess>
    </>
  );
}
