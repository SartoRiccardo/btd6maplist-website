import { getMap } from "@/server/maplistRequests";
import { MapForm_C } from "./page.client";

export const metadata = {
  title: "Edit Map | BTD6 Maplist",
};

const addCountKey = (list) => list.map((obj, i) => ({ ...obj, count: -1 - i }));

export default async function AddMap({ params }) {
  const { code } = params;
  const mapData = await getMap(code);

  if (!mapData) return <ResourceNotFound label="map" />;

  const initialValues = {
    ...mapData,
    placement_curver: mapData.placement_cur.toString(),
    placement_allver: mapData.placement_all.toString(),
    difficulty: mapData.difficulty.toString(),
    map_data: ["a", null].includes(mapData.map_data) ? "" : mapData.map_data,
    map_data_req_permission: mapData.map_data === "a",
    r6_start: mapData.r6_start === null ? "" : mapData.r6_start,
    aliases: addCountKey(mapData.aliases.map((alias) => ({ alias }))),
    creators: addCountKey(
      mapData.creators.map(({ role, name }) => ({
        id: name,
        role: role ? role : "",
      }))
    ),
    verifiers: addCountKey(
      mapData.verifications.map(({ name, version }) => ({
        id: name,
        version: version ? version.toString() : "",
      }))
    ),
    additional_codes: addCountKey(
      mapData.additional_codes.map((obj) => ({
        ...obj,
        description: obj.description ? obj.description : "",
      }))
    ),
    version_compatibilities: addCountKey(
      mapData.map_data_compatibility.map(({ status, version }) => ({
        status: status.toString(),
        version: version.toString(),
      }))
    ),
  };
  const toDelete = [
    "lccs",
    "verified",
    "placement_cur",
    "placement_all",
    "map_data_compatibility",
    "verifications",
  ];
  for (const td of toDelete) delete initialValues[td];

  return (
    <>
      <h1 className="text-center">Edit Map - {code}</h1>

      <MapForm_C code={code} initialValues={initialValues} />
    </>
  );
}
