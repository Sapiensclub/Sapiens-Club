"use client";

import { useState } from "react";
import { site } from "@/lib/site";

/*
 * Curated city dropdown (spec §6-S8). Choosing "Other" reveals a free-text
 * field. Reports a single city string upwards via the two hidden-ish
 * mechanics: the select for known cities, the text input otherwise.
 */
export function CitySelect({
  onChange,
}: {
  onChange: (city: string) => void;
}) {
  const [choice, setChoice] = useState("");
  const isOther = choice === "Other";

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="city" className="text-sm font-bold">
        Your city
      </label>
      <select
        id="city"
        name="city"
        value={choice}
        onChange={(e) => {
          setChoice(e.target.value);
          onChange(e.target.value === "Other" ? "" : e.target.value);
        }}
        className="sketch-border border-2 border-ink bg-paper px-4 py-2.5"
      >
        <option value="">Choose a city…</option>
        {site.cities.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      {isOther && (
        <>
          <label htmlFor="city-other" className="sr-only">
            Tell us your city
          </label>
          <input
            id="city-other"
            type="text"
            placeholder="Tell us your city"
            onChange={(e) => onChange(e.target.value)}
            className="sketch-border border-2 border-ink bg-paper px-4 py-2.5"
          />
        </>
      )}
    </div>
  );
}
