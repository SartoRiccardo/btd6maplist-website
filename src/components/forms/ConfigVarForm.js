"use client";
import { useAuthLevels, useMaplistConfig } from "@/utils/hooks";
import { useState } from "react";
import ConfigForm from "./form-components/ConfigForm";

const configNames = {
  points_top_map: "Points for the #1 map",
  points_bottom_map: "Points for the last map",
  formula_slope: "Formula slope",
  points_extra_lcc: "Extra points for LCCs",
  points_multi_gerry: "No Optimal Hero point multiplier",
  points_multi_bb: "Black Border point multiplier",
  decimal_digits: "Decimal digits to round to",
  map_count: "Number of maps on the list",
  current_btd6_ver: "Current BTD6 version",
};

export default function ConfigVarForm() {
  const [success, setSuccess] = useState(false);
  const config = useMaplistConfig();
  const authLevels = useAuthLevels();

  if (!(authLevels.isAdmin || authLevels.isListMod)) return null;

  const defaultVals = {
    ...config,
    current_btd6_ver: config.current_btd6_ver / 10,
  };
  for (const key of Object.keys(defaultVals)) {
    if (!Object.keys(configNames).includes(key)) delete defaultVals[key];
  }

  const getValues = (values) => {
    return {
      ...values,
      formula_slope: values.formula_slope.toString(),
      current_btd6_ver: Math.floor(values.current_btd6_ver * 10).toString(),
    };
  };

  return (
    <div data-cy="form-maplist-config">
      <h2 className="text-center">Maplist Config Variables</h2>
      <ConfigForm
        getValues={getValues}
        initialValues={defaultVals}
        configNames={configNames}
        success={success}
        setSuccess={setSuccess}
        intFields={["decimal_digits", "map_count"]}
        floatFields={[
          "points_top_map",
          "points_bottom_map",
          "formula_slope",
          "points_extra_lcc",
          "points_multi_gerry",
          "points_multi_bb",
          "current_btd6_ver",
        ]}
      />
    </div>
  );
}
