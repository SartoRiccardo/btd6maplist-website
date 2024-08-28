"use client";
import AddMapButton from "@/components/buttons/AddMapButton";
import { useAuthLevels } from "@/utils/hooks";

export default function AddMapListEntry({ on }) {
  const { loaded, isExplistMod, isListMod } = useAuthLevels();

  return loaded &&
    ((on.includes("experts") && isExplistMod) ||
      (on.includes("list") && isListMod)) ? (
    <div className="col-12 col-sm-6 col-lg-4">
      <AddMapButton href="/map/add" />
    </div>
  ) : null;
}
