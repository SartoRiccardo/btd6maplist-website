import cssMedals from "@/components/maps/Medals.module.css";

export default function Medal({ src, padEnd, padStart, padHeight, border }) {
  return (
    <img
      src={src}
      className={`${cssMedals.inline_medal} ${padHeight ? "my-2" : ""} ${
        padEnd ? "me-2" : ""
      } ${padStart ? "me-2" : ""} ${border ? cssMedals.format_border : ""}`}
    />
  );
}
