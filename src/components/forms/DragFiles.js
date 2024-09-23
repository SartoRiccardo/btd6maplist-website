"use client";
import stylesDrgF from "./DragFiles.module.css";
import { useRef, useState } from "react";

// https://medium.com/@dprincecoder/creating-a-drag-and-drop-file-upload-component-in-react-a-step-by-step-guide-4d93b6cc21e0
export default function DragFiles({
  name,
  value,
  onChange,
  disabled,
  formats,
  limit,
  children,
  className,
  style,
  isValid,
  icon,
  showChildren,
}) {
  limit = limit || 0; // 0 - No limit
  className = className || "";
  style = style || {};
  formats = formats ? formats.map((f) => f.toLowerCase()) : [];
  icon = icon || "bi-image";

  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const processFiles = (evt, filesArray) => {
    if (disabled) return;

    if (formats.length)
      filesArray = filesArray.filter(({ name }) => {
        const splitName = name.split(".");
        return formats.includes(splitName[splitName.length - 1].toLowerCase());
      });
    if (limit > 0) filesArray = filesArray.slice(0, limit);
    filesArray = filesArray.map((file) => ({
      file,
      objectUrl: URL.createObjectURL(file),
    }));
    onChange({ ...evt, target: { ...evt.target, name, value: filesArray } });
  };

  const handleDrop = (evt) => {
    if (disabled) return;
    evt.preventDefault();
    const droppedFiles = evt.dataTransfer.files;
    processFiles(evt, Array.from(droppedFiles));
  };

  const handleClick = (_e) => {
    if (disabled) return;
    inputRef.current.click();
  };

  const handleChangeFromFS = (evt) => {
    evt.preventDefault();
    processFiles(evt, Array.from(evt.target.files));
  };

  return (
    <div
      className={`${stylesDrgF.dragfiles} ${
        disabled ? stylesDrgF.disabled : ""
      } ${dragging ? stylesDrgF.dragging : ""} ${className}`}
      style={style}
      name={name}
      onDrop={handleDrop}
      onClick={handleClick}
      onDragOver={(evt) => evt.preventDefault()}
    >
      <input
        type="file"
        ref={inputRef}
        hidden
        onChange={handleChangeFromFS}
        accept={formats.map((f) => `.${f}`).join(",")}
      />
      {value.length || showChildren ? (
        children
      ) : (
        <div className="d-flex justify-content-center">
          <i
            className={`bi ${icon} align-self-center ${stylesDrgF.dragfile_icon}`}
          />
        </div>
      )}
      {isValid && (
        <div className={stylesDrgF.dragfiles_validity}>
          <i className={`bi bi-check-circle-fill ${stylesDrgF.valid}`} />
        </div>
      )}
      <div
        className={stylesDrgF.dragdetector}
        onDragEnter={(_e) => setDragging(true)}
        onDragLeave={(_e) => setDragging(false)}
        onDragEnd={(_e) => setDragging(false)}
        onDrop={(_e) => setDragging(false)}
      />
    </div>
  );
}
