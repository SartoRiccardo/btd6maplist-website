"use client";
import { selectDiscordAccessToken } from "@/features/authSlice";
import { selectMaplistConfig } from "@/features/maplistSlice";
import { useAppSelector } from "@/lib/store";
import { editConfig } from "@/server/maplistRequests.client";
import { isFloat, isInt } from "@/utils/functions";
import { Formik } from "formik";
import { Fragment } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";

const configNames = {
  points_top_map: "Points for the #1 map",
  points_bottom_map: "Points for the last map",
  formula_slope: "Formula slope",
  points_extra_lcc: "Extra points for LCCs",
  points_multi_gerry: "No Geraldo point multiplier",
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

export default function ConfigVarPage() {
  const config = useAppSelector(selectMaplistConfig);
  const accessToken = useAppSelector(selectDiscordAccessToken);
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
  };

  return (
    <>
      <h1 className="text-center">Config Variables</h1>

      <Formik
        onSubmit={handleSubmit}
        validate={validate}
        initialValues={defaultVals}
      >
        {({ handleSubmit, handleChange, values, errors, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <div className="panel panel-container">
              <div className="row flex-row-space">
                {Object.keys(config).map((key) => (
                  <Fragment key={key}>
                    <div className="col-5 col-sm-6">
                      <p>{configNames[key]}</p>
                    </div>
                    <div className="col-7 col-sm-6">
                      <Form.Group>
                        <Form.Control
                          name={key}
                          type="text"
                          placeholder={defaultVals[key]}
                          value={values[key]}
                          onChange={handleChange}
                          isInvalid={values[key].length === 0 || key in errors}
                          disabled={isSubmitting}
                          autoComplete="off"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors[key]}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>

            <div className="d-flex flex-col-space justify-content-center">
              <Button disabled={isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
