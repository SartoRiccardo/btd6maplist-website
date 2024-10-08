"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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

  const PageButtons = () => (
    <div className="flex-hcenter">
      <button
        className="btn btn-primary"
        disabled={page <= 1}
        onClick={() =>
          router.replace(
            `${pathname}?` +
              new URLSearchParams({
                ...searchParams,
                [qname]: page - 1,
              }).toString(),
            { scroll: false }
          )
        }
      >
        &laquo;
      </button>
      <p className="fs-5 px-3 mb-0 align-self-center">
        {page}/{total}
      </p>
      <button
        className="btn btn-primary"
        disabled={page >= total}
        onClick={() =>
          router.replace(
            `${pathname}?` +
              new URLSearchParams({
                ...searchParams,
                [qname]: page + 1,
              }).toString(),
            { scroll: false }
          )
        }
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
