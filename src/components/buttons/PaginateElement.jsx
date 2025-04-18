"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function PaginateElement({
  qname,
  page,
  total,
  children,
  className,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // https://github.com/vercel/next.js/issues/49774#issuecomment-1616138326
  const urlParams = new URLSearchParams(Array.from(searchParams.entries()));
  urlParams.set(qname, page - 1);
  const prevUrl = `${pathname}?${urlParams.toString()}`;

  urlParams.set(qname, page + 1);
  const nextUrl = `${pathname}?${urlParams.toString()}`;

  useEffect(() => {
    if (page + 1 <= total) router.prefetch(nextUrl);
    if (page - 1 > 0) router.prefetch(prevUrl);
  }, [pathname, qname, page]);

  const PageButtons = () => (
    <div className="flex-hcenter">
      <button
        className="btn btn-primary width-auto"
        disabled={page <= 1}
        onClick={() => router.replace(prevUrl, { scroll: false })}
        data-cy="btn-paginate-back"
      >
        &laquo;
      </button>
      <p className="fs-5 px-3 mb-0 align-self-center">
        {page}/{total}
      </p>
      <button
        className="btn btn-primary width-auto"
        disabled={page >= total}
        onClick={() => router.replace(nextUrl, { scroll: false })}
        data-cy="btn-paginate-next"
      >
        &raquo;
      </button>
    </div>
  );

  return (
    <div className={className || ""}>
      {total > 1 && <PageButtons />}
      {children}
      {total > 1 && <PageButtons />}
    </div>
  );
}
