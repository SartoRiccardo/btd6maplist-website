"use client";
import { setConfig } from "@/features/maplistSlice";
import { editConfig } from "@/server/maplistRequests.client";
import { revalidateLeaderboard } from "@/server/revalidations";
import { isFloat, isInt } from "@/utils/functions";
import { useDiscordToken, useMaplistConfig } from "@/utils/hooks";
import { Formik } from "formik";
import { Fragment, useState } from "react";
import { Toast } from "react-bootstrap";
import { useDispatch } from "react-redux";
import Input from "./bootstrap/Input";

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

const intFields = ["decimal_digits", "map_count"];
const floatFields = [
  "points_top_map",
  "points_bottom_map",
  "formula_slope",
  "points_extra_lcc",
  "points_multi_gerry",
  "points_multi_bb",
  "current_btd6_ver",
];

export default function ConfigVarForm() {
  const [success, setSuccess] = useState(false);
  const config = useMaplistConfig();
  const accessToken = useDiscordToken();
  const dispatch = useDispatch();

  const defaultVals = {
    ...config,
    current_btd6_ver: config.current_btd6_ver / 10,
  };

  const validate = (values) => {
    const errors = {};
    for (const key of Object.keys(values)) {
      if (intFields.includes(key)) {
        if (!isInt(values[key])) errors[key] = "This must be an integer number";
      } else if (floatFields.includes(key)) {
        if (!isFloat(values[key])) errors[key] = "This must be a number";
      }
    }
    return errors;
  };

  const handleSubmit = async (values, { setErrors }) => {
    values = {
      ...values,
      formula_slope: values.formula_slope.toString(),
      current_btd6_ver: Math.floor(values.current_btd6_ver * 10).toString(),
    };
    const { errors, data } = await editConfig(accessToken.access_token, values);
    if (Object.keys(errors).length) {
      setErrors(errors);
      return;
    }
    revalidateLeaderboard();
    dispatch(setConfig({ config: data }));
    setSuccess(true);
  };

  return (
    <>
      <Formik
        onSubmit={handleSubmit}
        validate={validate}
        initialValues={defaultVals}
      >
        {({ handleSubmit, handleChange, values, errors, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <div className="panel panel-container">
              <div className="row flex-row-space">
                {Object.keys(config)
                  .sort()
                  .map((key) => (
                    <Fragment key={key}>
                      <div className="col-5 col-sm-6">
                        <p>{configNames[key]}</p>
                      </div>
                      <div className="col-7 col-sm-6">
                        <div>
                          <Input
                            name={key}
                            type="text"
                            placeholder={defaultVals[key]}
                            value={values[key]}
                            onChange={handleChange}
                            isInvalid={
                              values[key].length === 0 || key in errors
                            }
                            disabled={isSubmitting}
                            autoComplete="off"
                          />
                          <div className="invalid-feedback">{errors[key]}</div>
                        </div>
                      </div>
                    </Fragment>
                  ))}
              </div>
            </div>

            <div className="d-flex flex-col-space justify-content-center">
              <button
                className="btn btn-primary"
                disabled={isSubmitting}
                type="submit"
              >
                Save
              </button>
            </div>
          </form>
        )}
      </Formik>

      <Toast
        bg="success"
        className="notification"
        show={success}
        onClose={() => setSuccess(false)}
        delay={4000}
        autohide
      >
        <Toast.Body>Config variables modified successfully!</Toast.Body>
      </Toast>
    </>
  );
}
