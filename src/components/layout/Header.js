import { luckiestGuy } from "@/lib/fonts";
import header from "./header.module.css";

export default function Header() {
  return (
    <header className={header.header + " shadow"}>
      <div className="row">
        <div className="col">
          <div className="d-flex flex-column justify-content-center h-100">
            <p className={`${luckiestGuy.className}`}>BTD6 Maplist</p>
          </div>
        </div>
      </div>
    </header>
  );
}
