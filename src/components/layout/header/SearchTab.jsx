"use client";
import { useRouter } from "next/navigation";
import cssSearch from "./SearchTab.module.css";
import Input from "@/components/forms/bootstrap/Input";
import { forwardRef, useRef, useState } from "react";
import { AutoComplete } from "@/components/forms/form-components/AutoComplete";

export default function SearchTab({
  onClick,
  open,
  onHide,
  mobile,
  onNavigate,
}) {
  const inputRef = useRef(null);

  const icon = open ? "bi-x-lg" : "bi-search";

  const handleClick = (evt) => {
    if (!open) inputRef.current.focus();
    onClick(evt);
  };

  return mobile ? (
    <li className={`${cssSearch.search} ${cssSearch.mobile}`}>
      <SearchInput searchBtn onNavigate={onNavigate} />
    </li>
  ) : (
    <li className={cssSearch.search}>
      <a onClick={handleClick} className="pe-2" href="#">
        <i className={`bi ${icon}`} />
      </a>

      <SearchInput
        onHide={onHide}
        open={open}
        ref={inputRef}
        onNavigate={onNavigate}
      />
    </li>
  );
}

const SearchInput = forwardRef(function (
  { onHide, open, searchBtn, onNavigate },
  ref
) {
  const inputRef = useRef(null);
  const router = useRouter();
  const [search, setSearch] = useState("");
  const searchTypes = ["user", "map"];

  ref = ref || inputRef;
  open = open === undefined ? true : open;

  const handleSubmit = (evt = null) => {
    if (evt) evt.preventDefault();
    const params = new URLSearchParams({ q: search });
    router.push(`/search?${params.toString()}`);
    if (onNavigate) onNavigate(evt);
  };

  return (
    <form className={open ? "" : cssSearch.hidden} onSubmit={handleSubmit}>
      <div>
        <AutoComplete
          query={search}
          type={searchTypes}
          onAutocomplete={({ type, data }) => {
            setSearch("");
            if (type === "user") {
              router.push(`/user/${data.id}`);
            } else if (type === "map") {
              router.push(`/map/${data.code}`);
            }
            if (onHide) onHide();
            if (onNavigate) onNavigate(null);
          }}
        >
          <Input
            type="text"
            name="q"
            placeholder="Search..."
            autoComplete="off"
            value={search}
            onChange={(evt) => setSearch(evt.target.value)}
            ref={ref}
          />
        </AutoComplete>
      </div>

      {searchBtn && (
        <div className="ps-4">
          <a onClick={handleSubmit} className="pe-2" href="#">
            <i className="bi bi-search" />
          </a>
        </div>
      )}
    </form>
  );
});
