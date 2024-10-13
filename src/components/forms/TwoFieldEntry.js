"use client";
import stylesFrmMap from "./MapForm.module.css";
import { FormikContext } from "@/contexts";
import { Fragment, useContext } from "react";
import Input from "./bootstrap/Input";

export default function TwoFieldEntry({
  name,
  fields,
  labels,
  firstProps,
  secondProps,
  omitFirstOptional,
  optional,
}) {
  const formikProps = useContext(FormikContext);
  const {
    handleChange,
    handleBlur,
    values,
    setValues,
    touched,
    errors,
    isSubmitting,
    disableInputs,
  } = formikProps;

  return values[name].map(({ count }, i) => {
    const realField1 = fields[0].replace("[i]", `[${i}]`);
    const realField2 = fields[1].replace("[i]", `[${i}]`);
    const topLevelField1 = fields[0].split("[")[0].split("(")[0];
    const topLevelField2 = fields[1].split("[")[0].split("(")[0];

    // Not flexible, should split by "." walk through the list
    const value1 = values[name][i][fields[0].split(".")[1]];
    const value2 = values[name][i][fields[1].split(".")[1]];

    return (
      <Fragment key={count || -1}>
        <div className="col-12 col-md-5 col-lg-6">
          <div>
            {labels && labels.length > 0 && (
              <label className="form-label">{labels[0]}</label>
            )}
            <Input
              name={realField1}
              type="text"
              value={value1}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched[topLevelField1] && realField1 in errors}
              isValid={values[realField1]}
              disabled={isSubmitting || disableInputs}
              autoComplete="off"
              {...firstProps}
            />
            <div className="invalid-feedback">{errors[realField1]}</div>
          </div>
        </div>
        <div className="col-9 col-md-5 col-lg-5">
          {!(omitFirstOptional && i === 0) && (
            <div>
              {labels && labels.length > 1 && (
                <label className="form-label">{labels[1]}</label>
              )}
              <Input
                name={realField2}
                type="text"
                value={value2}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched[topLevelField2] && realField2 in errors}
                isValid={value2}
                disabled={isSubmitting || disableInputs}
                autoComplete="off"
                {...secondProps}
              />
              <div className="invalid-feedback">{errors[realField2]}</div>
            </div>
          )}
        </div>

        <div className="col-3 col-md-2 col-lg-1 flex-hcenter">
          {(optional || i > 0) && (
            <div className="d-flex flex-column w-100">
              <button
                type="button"
                className={`btn btn-danger ${stylesFrmMap.map_form_rm_field}`}
                onClick={(_e) =>
                  setValues({
                    ...values,
                    [name]: values[name].filter((_v, idx) => idx !== i),
                  })
                }
              >
                <i className="bi bi-dash" />
              </button>
            </div>
          )}
        </div>
      </Fragment>
    );
  });
}
