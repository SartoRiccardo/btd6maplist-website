import Link from "next/link";

export default function ResourceNotFound({ label }) {
  return (
    <div className="d-flex flex-column justify-content-center w-100 h-100">
      <p className="muted fs-3 mb-1 text-center">
        Looks like that {label} doesn't exist!
      </p>
      <p className="muted text-center">
        <Link scroll={false} href="/">
          &laquo; Home
        </Link>
      </p>
    </div>
  );
}
