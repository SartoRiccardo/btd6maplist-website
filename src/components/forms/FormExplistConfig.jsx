"use client";
import { useAuthLevels, useMaplistConfig } from "@/utils/hooks";
import { useState } from "react";
import ConfigForm from "./form-components/ConfigForm";

const configNames = {
  exp_points_casual: "Casual Exp completion points",
  exp_points_medium: "Medium Exp completion points",
  exp_points_high: "High Exp completion points",
  exp_points_true: "True Exp completion points",
  exp_points_extreme: "Extreme Exp completion points",
  current_btd6_ver: "Current BTD6 version",
};

export default function FormExplistConfig() {
  const [success, setSuccess] = useState(false);
  const config = useMaplistConfig();
  const authLevels = useAuthLevels();

  if (!(authLevels.isAdmin || authLevels.isExplistMod)) return null;

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
      current_btd6_ver: Math.floor(values.current_btd6_ver * 10).toString(),
    };
  };

  return (
    <div data-cy="form-experts-config">
      <h2 className="text-center">Experts Config Variables</h2>
      <ConfigForm
        getValues={getValues}
        initialValues={defaultVals}
        configNames={configNames}
        success={success}
        setSuccess={setSuccess}
        intFields={[
          "exp_points_casual",
          "exp_points_medium",
          "exp_points_high",
          "exp_points_true",
          "exp_points_extreme",
        ]}
        floatFields={["current_btd6_ver"]}
      />
    </div>
  );
}
