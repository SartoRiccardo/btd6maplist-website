import PaginateElement from "@/components/buttons/PaginateElement";
import MapSubmission from "@/components/maps/MapSubmission";
import { getMapSubmissions } from "@/server/maplistRequests";
import Link from "next/link";

export default async function MapSubmissionList({ searchParams }) {
  let show = searchParams?.show || "pending";
  if (!["pending", "all"].includes(show.toLowerCase())) show = "current";
  let page = searchParams?.page || "1";
  if (!/^\d+$/.test(page)) page = "1";
  page = parseInt(page);

  const submissions = await getMapSubmissions(show, page);

  return (
    <>
      <h1 className="text-center">Map Submissions</h1>

      <div className="mb-3 d-flex justify-content-center row-space">
        <Link
          href={
            `/map-submissions?` +
            new URLSearchParams({
              ...searchParams,
              show: show === "pending" ? "all" : "pending",
            }).toString()
          }
        >
          <span className="btn btn-primary fs-6">Show Rejected</span>
        </Link>
      </div>

      <PaginateElement qname="page" page={page} total={submissions.pages}>
        {submissions.submissions.map((subm) => (
          <MapSubmission key={`${subm.code}${subm.type}`} {...subm} />
        ))}
      </PaginateElement>
    </>
  );
}
