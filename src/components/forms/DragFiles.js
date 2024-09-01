"use client";

import { useRef } from "react";

// https://medium.com/@dprincecoder/creating-a-drag-and-drop-file-upload-component-in-react-a-step-by-step-guide-4d93b6cc21e0
export default function DragImage({
  name,
  value,
  onChange,
  disabled,
  formats,
  limit,
  children,
  className,
  style,
}) {
  limit = limit || 0; // 0 - No limit
  className = className || "";
  style = style || {};
  formats = formats ? formats.map((f) => f.toLowerCase()) : [];

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
    evt.preventDefault();
    const droppedFiles = evt.dataTransfer.files;
    processFiles(evt, Array.from(droppedFiles));
  };

  const handleClick = (_e) => {
    inputRef.current.click();
  };

  const handleChangeFromFS = (evt) => {
    evt.preventDefault();
    processFiles(evt, Array.from(evt.target.files));
  };

  return (
    <div
      className={`dragfiles ${disabled ? "disabled" : ""} ${className}`}
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
      {value.length ? (
        children
      ) : (
        <div className="d-flex justify-content-center">
          <i className="bi bi-file-earmark-arrow-up-fill align-self-center dragfile-icon" />
        </div>
      )}
    </div>
  );
}
