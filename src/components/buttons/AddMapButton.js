import Link from "next/link";
import { btd6Font } from "@/lib/fonts";

export default function AddMapButton({ onClick, href, className }) {
  const component = (
    <div
      className={`shadow btd6map pb-3 ${className ? className : ""}`}
      onClick={(evt) => onClick && onClick(evt)}
      tabIndex={0}
    >
      <p className={`mapTitle ${btd6Font.className} font-border`}>
        Add New Map
      </p>

      <div className="btd6mapImage empty flex-vcenter">
        <div className="flex-hcenter">
          <i className="btd6map-add bi bi-plus" />
        </div>
      </div>
    </div>
  );

  return href ? (
    <Link className="btd6map-clickable" href={href} scroll={false}>
      {component}
    </Link>
  ) : (
    <div className="btd6map-clickable">{component}</div>
  );
}
