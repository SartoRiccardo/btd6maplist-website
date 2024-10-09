"use client";
import { setConfig } from "@/features/maplistSlice";
import { editConfig } from "@/server/maplistRequests.client";
import { revalidateLeaderboard } from "@/server/revalidations";
import { Formik } from "formik";
import LazyToast from "@/components/transitions/LazyToast";
import { Fragment } from "react";
import Input from "../bootstrap/Input";
import { useDispatch } from "react-redux";
import { useDiscordToken } from "@/utils/hooks";
import { isFloat, isInt } from "@/utils/functions";

export default function ConfigForm({
  getValues,
  intFields,
  floatFields,
  initialValues,
  configNames,
  success,
  setSuccess,
}) {
  const accessToken = useDiscordToken();
  const dispatch = useDispatch();

  intFields = intFields || [];
  floatFields = floatFields || [];

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
    values = getValues(values);
    const { errors, data } = await editConfig(accessToken.access_token, values);
    if (Object.keys(errors).length) {
      setErrors(errors);
      return;
    }
    dispatch(setConfig({ config: data }));
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
              <div className="row flex-row-space">
                {Object.keys(configNames)
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
                            placeholder={initialValues[key]}
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

      <LazyToast
        bg="success"
        className="notification"
        show={success}
        onClose={() => setSuccess(false)}
        delay={4000}
        autohide
      >
        <div className="toast-body">
          Config variables modified successfully!
        </div>
      </LazyToast>
    </>
  );
}
