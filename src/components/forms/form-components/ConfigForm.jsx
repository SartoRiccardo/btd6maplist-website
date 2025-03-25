"use client";
import { patchConfig } from "@/features/maplistSlice";
import { editConfig } from "@/server/maplistRequests.client";
import { revalidateLeaderboard } from "@/server/revalidations";
import { Formik } from "formik";
import LazyToast from "@/components/transitions/LazyToast";
import { Fragment, useState } from "react";
import Input from "../bootstrap/Input";
import { useDispatch } from "react-redux";
import { useDiscordToken } from "@/utils/hooks";
import { isFloat, isInt } from "@/utils/functions";
import Medal from "@/components/decoration/Medal";

export default function ConfigForm({ fields }) {
  const [success, setSuccess] = useState(false);
  const accessToken = useDiscordToken();
  const dispatch = useDispatch();

  let intFields = Object.keys(fields).filter(
    (vname) => fields[vname].type === "int"
  );
  let floatFields = Object.keys(fields).filter(
    (vname) => fields[vname].type === "float"
  );
  if (intFields.includes("current_btd6_ver")) {
    intFields = intFields.filter((vname) => vname !== "current_btd6_ver");
    floatFields.push("current_btd6_ver");
  }

  const initialValues = {};
  Object.keys(fields).forEach(
    (vname) => (initialValues[vname] = fields[vname].value)
  );
  if (initialValues?.current_btd6_ver)
    initialValues.current_btd6_ver = initialValues.current_btd6_ver / 10;

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
    values = { ...values };
    if (values?.current_btd6_ver)
      values.current_btd6_ver = Math.floor(
        values.current_btd6_ver * 10
      ).toString();
    if (values?.formula_slope)
      values.formula_slope = values.formula_slope.toString();

    const { errors, data } = await editConfig(accessToken.access_token, values);
    if (Object.keys(errors).length) {
      setErrors(errors);
      return;
    }
    dispatch(patchConfig({ config: data }));
    setSuccess(true);
    revalidateLeaderboard();
  };

  return (
    <>
      <Formik
        onSubmit={handleSubmit}
        validate={validate}
        initialValues={initialValues}
      >
        {({ handleSubmit, handleChange, values, errors, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <div className="panel panel-container">
              <h2 className="text-center">Config Variables</h2>
              <div className="row flex-row-space">
                {Object.keys(fields).map((key) => (
                  <Fragment key={key}>
                    <div className="col-5 col-sm-6">
                      <p>
                        {key.includes("gerry") && (
                          <Medal src="/medals/medal_nogerry.webp" />
                        )}
                        {key.includes("bb") && (
                          <Medal src="/medals/medal_bb.webp" />
                        )}
                        {key.includes("lcc") && (
                          <Medal src="/medals/medal_lcc.webp" />
                        )}{" "}
                        {fields[key]?.description || key}
                      </p>
                    </div>
                    <div className="col-7 col-sm-6">
                      <div data-cy="form-group">
                        <Input
                          name={key}
                          type="text"
                          placeholder={initialValues[key]}
                          value={values[key]}
                          onChange={handleChange}
                          isInvalid={values[key].length === 0 || key in errors}
                          disabled={isSubmitting}
                          autoComplete="off"
                        />
                        <div className="invalid-feedback">{errors[key]}</div>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>

              <div className="d-flex flex-col-space justify-content-center mt-3">
                <button
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  type="submit"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        )}
      </Formik>

      <LazyToast
        bg="success"
        className="notification"
        show={success}
        onClose={() => setSuccess(false)}
        delay={4000}
        autohide
      >
        <div className="toast-body" data-cy="toast-success">
          Config variables modified successfully!
        </div>
      </LazyToast>
    </>
  );
}
