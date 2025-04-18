import Image from "next/image";

export default ({ children }) => (
  <div className="d-flex flex-column align-items-center">
    <Image src="/misc/defeat.webp" width={1024 / 3} height={580 / 3} alt="" />
    <hr className="mt-0 w-100" />
    <p className="lead muted text-center">{children}</p>
  </div>
);
