import stylesDiffS from "../maps/DifficultySelector.module.css";
import { btd6Font } from "@/lib/fonts";

export default function SelectorButton({
  text,
  children,
  active,
  className,
  textSize,
  squareImage,
}) {
  return (
    <div
      className={`${stylesDiffS.img_wrapper} shadow ${
        active ? stylesDiffS.active : ""
      } ${squareImage ? stylesDiffS.square : ""} ${className || ""}`}
    >
      {children}

      <p
        className={`${btd6Font.className} ${
          textSize === "lg" ? stylesDiffS.text_large : ""
        } font-border text-center text-nowrap`}
      >
        <span className={stylesDiffS.label_inner}>{text}</span>
      </p>
    </div>
  );
}
