"use client";
import cssAutoC from "./AutoComplete.module.css";
import { search } from "@/server/maplistRequests.client";
import { useEffect, useRef, useState } from "react";

export function AutoComplete({
  type,
  query,
  limit,
  fetchAfter,
  children,
  onAutocomplete,
  minLength,
}) {
  type = type || ["user"];
  limit = limit || 5;
  fetchAfter = fetchAfter || 300;
  onAutocomplete = onAutocomplete || function () {};
  minLength = minLength || 3;

  const [justCompleted, setJustCompleted] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const latestSearchId = useRef(null);
  const completionsRef = useRef(null);
  const wrapperRef = useRef(null);

  const handleAutocomplete = (content) => {
    onAutocomplete(content);
    setJustCompleted(true);
  };

  const handleKeyDown = (evt) => {
    if (completionsRef.current === null) return;

    const KEY_UP = 38,
      KEY_DOWN = 40,
      KEY_SPACE = 32,
      KEY_ENTER = 13;

    const autocItems = [...completionsRef.current.children];
    if (evt.keyCode === KEY_UP) {
      evt.preventDefault();
      const newFocus = autocItems.indexOf(document.activeElement) - 1;
      if (newFocus >= 0) autocItems[newFocus].focus();
      else wrapperRef.current.children[0].focus();
    } else if (evt.keyCode === KEY_DOWN) {
      evt.preventDefault();
      const newFocus = autocItems.indexOf(document.activeElement) + 1;
      if (newFocus < autocItems.length) autocItems[newFocus].focus();
    } else if ([KEY_SPACE, KEY_ENTER].includes(evt.keyCode)) {
      evt.preventDefault();
      handleAutocomplete(document.activeElement.attributes["data-value"].value);
    }
  };

  useEffect(() => {
    const fetchResults = async () => {
      const currentSearchId = Math.random();
      latestSearchId.current = currentSearchId;

      setTimeout(async () => {
        if (latestSearchId.current !== currentSearchId) return;
        const results = await search(query, type, limit);
        if (latestSearchId.current == currentSearchId)
          setSearchResults(results);
      }, fetchAfter);
    };

    if (query.length >= minLength) fetchResults();
    setJustCompleted(false);
  }, [query]);

  return (
    <div
      className={cssAutoC.autocomplete_wrapper}
      onKeyDown={handleKeyDown}
      ref={wrapperRef}
    >
      {children}
      {searchResults.length > 0 &&
        !justCompleted &&
        query.length >= minLength && (
          <div className={cssAutoC.autocomplete}>
            <ul ref={completionsRef}>
              {searchResults.map(({ type, data }) => {
                let key, content;
                if (type === "user") {
                  key = `usr-${data.id}`;
                  content = data.name;
                } else if (type === "map") {
                  key = `map-${data.code}`;
                  content = data.name;
                }
                return (
                  <li
                    data-value={content}
                    key={key}
                    onClick={() => handleAutocomplete(content)}
                    tabIndex={0}
                  >
                    {content}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
    </div>
  );
}
