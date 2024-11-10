import MapList from "@/components/layout/maplists/MapList";
import UserEntry from "@/components/users/UserEntry";
import { search } from "@/server/maplistRequests.client";

export default async function SearchPage({ searchParams }) {
  const results = searchParams.q
    ? await search(searchParams.q, ["user", "map"].join(","), 100, {
        server: true,
      })
    : [];

  const maps = [],
    users = [];
  results.forEach(({ type, data }) => {
    if (type === "user") users.push(data);
    else if (type === "map") maps.push(data);
  });

  return (
    <>
      <h1 className="text-center">
        Search Results{searchParams?.q?.length > 0 && <> - {searchParams.q}</>}
      </h1>

      {results.length ? (
        <>
          {users.length > 0 && (
            <div className="mb-4">
              <h2 className="text-center">Users</h2>
              {users.map((profile) => (
                <div className="panel w-100 my-2">
                  <UserEntry
                    id={profile.id}
                    lead
                    centered
                    placeholderProfile={profile}
                  />
                </div>
              ))}
            </div>
          )}

          {maps.length > 0 && (
            <>
              <h2 className="text-center">Maps</h2>
              <MapList maps={maps} noSubmit noMedals bottomInfo />
            </>
          )}
        </>
      ) : (
        <p className="mt-4 text-center lead muted">
          There were no results for your search...
        </p>
      )}
    </>
  );
}
