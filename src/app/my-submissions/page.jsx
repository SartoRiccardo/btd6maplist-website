import PaginateElement from "@/components/buttons/PaginateElement";
import MapSubmission from "@/components/maps/MapSubmission";
import { getOwnSubmissions } from "@/server/maplistRequests";
import Link from "next/link";
import CompletionRowSubmission from "@/components/maps/CompletionRowSubmission";
import UserEntry from "@/components/users/UserEntry";
import Btd6MapRowPreview from "@/components/ui/Btd6MapRowPreview";
import { groupConsecutiveCompsByMap } from "@/utils/functions";

export default async function MySubmissions({ searchParams }) {
    const submissionType = searchParams.type || 'map';
    const page = parseInt(searchParams.page || '1');

    const submissions = await getOwnSubmissions(submissionType, page);

    const completionGroups = submissionType === 'completion' ? groupConsecutiveCompsByMap(submissions.data) : [];

    return (
        <>
            <h1 className="text-center">My Submissions</h1>

            <div className="d-flex justify-content-center my-3">
                <Link href="/my-submissions?type=map">
                    <span className={`btn btn-primary ${submissionType === 'map' ? 'active' : ''}`}>
                        Maps
                    </span>
                </Link>
                <Link href="/my-submissions?type=completion">
                    <span className={`btn btn-primary ${submissionType === 'completion' ? 'active' : ''} ms-2`}>
                        Completions
                    </span>
                </Link>
            </div>

            <PaginateElement qname="page" page={page} total={submissions.pages}>
                {submissionType === 'map' && submissions.data.map((sub) => (
                    <MapSubmission key={sub.code + sub.format} {...sub} readOnly />
                ))}

                {submissionType === 'completion' && (completionGroups.length > 0 ? (
                    completionGroups.map((runs, i) => {
                        const mapData = runs[0].map;
                        return (
                            <div className="my-3" key={i}>
                                <div className="panel py-2 rounded-bottom-0">
                                    <Btd6MapRowPreview
                                        name={mapData.name}
                                        previewUrl={mapData.map_preview_url}
                                    />
                                </div>
    
                                {runs.map((completion, i) => (
                                    <CompletionRowSubmission
                                        key={completion.id}
                                        isLast={i === runs.length - 1}
                                        completion={completion}
                                        userEntry={completion.users.map((uid) => (
                                            <UserEntry key={uid} id={uid} centered lead="sm" />
                                        ))}
                                        readOnly
                                    />
                                ))}
                            </div>
                        );
                    })
                ) : <p className='text-center'>No completions found.</p>)}
            </PaginateElement>
        </>
    );
}
