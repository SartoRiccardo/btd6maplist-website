import stylesMap from "../maps/Btd6Map.module.css";
import { btd6Font } from "@/lib/fonts";
import Image from "../utils/Image";

export default function Btd6MapRowPreview({ previewUrl, name }) {
  return (
    <div className="d-flex align-self-center">
      <Image
        className={`${stylesMap.btd6map_image} ${stylesMap.btd6map_small}`}
        src={previewUrl}
        alt=""
        width={225}
        height={150}
      />
      <div className="d-flex flex-column justify-content-center">
        <p className={`mb-0 ps-3 ${btd6Font.className} font-border fs-5`}>
          {name}
        </p>
      </div>
    </div>
  );
}
