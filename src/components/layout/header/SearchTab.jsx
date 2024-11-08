"use client";
import { useRouter } from "next/navigation";
import cssSearch from "./SearchTab.module.css";
import Input from "@/components/forms/bootstrap/Input";
import { useEffect, useRef, useState } from "react";
import { AutoComplete } from "@/components/forms/form-components/AutoComplete";

export default function SearchTab({ onClick, open }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const [search, setSearch] = useState("");
  const [forceSubmit, setForceSubmit] = useState(false);

  const icon = open ? "bi-x-lg" : "bi-search";
  const searchTypes = ["user", "map"];

  const handleClick = (evt) => {
    if (!open) inputRef.current.focus();
    onClick(evt);
  };

  const handleSubmit = (evt = null) => {
    if (evt) evt.preventDefault();
    const params = new URLSearchParams({ q: search });
    router.push(`/search?${params.toString()}`);
    // setForceSubmit(false);
  };

  useEffect(() => {
    if (forceSubmit) handleSubmit();
  }, [forceSubmit]);

  return (
    <li className={cssSearch.search}>
      <a onClick={handleClick} className="pe-2" href="#">
        <i className={`bi ${icon}`} />
      </a>

      <form className={open ? "" : cssSearch.hidden} onSubmit={handleSubmit}>
        <div>
          <AutoComplete
            query={search}
            type={searchTypes}
            onAutocomplete={(value) => {
              setSearch(value);
              setForceSubmit(true);
            }}
          >
            <Input
              type="text"
              name="q"
              placeholder="Search..."
              autoComplete="off"
              value={search}
              onChange={(evt) => setSearch(evt.target.value)}
              ref={inputRef}
            />
          </AutoComplete>
        </div>
      </form>
    </li>
  );
}
