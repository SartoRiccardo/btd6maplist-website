"use client";
import stylesFrmMap from "./FormMap.module.css";
import { FormikContext } from "@/contexts";
import { Fragment, useContext } from "react";
import Input from "./bootstrap/Input";
import { AutoComplete } from "./form-components/AutoComplete";

export default function TwoFieldEntry({
  name,
  fields,
  labels,
  firstProps,
  secondProps,
  omitFirstOptional,
  optional,
  firstIsUser,
  disabled,
}) {
  const formikProps = useContext(FormikContext);
  const {
    handleChange,
    handleBlur,
    values,
    setValues,
    setFieldValue,
    touched,
    errors,
    isSubmitting,
    disableInputs,
  } = formikProps;

  return (
    <div className="row gy-2 gx-1 gx-lg-1">
      {values[name].map(({ count }, i) => {
        const realField1 = fields[0].replace("[i]", `[${i}]`);
        const realField2 = fields[1].replace("[i]", `[${i}]`);
        const topLevelField1 = fields[0].split("[")[0].split("(")[0];
        const topLevelField2 = fields[1].split("[")[0].split("(")[0];

        // Not flexible, should split by "." walk through the list
        const value1 = values[name][i][fields[0].split(".")[1]];
        const value2 = values[name][i][fields[1].split(".")[1]];

        const firstField = (
          <Input
            name={realField1}
            type="text"
            value={value1}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={touched[topLevelField1] && realField1 in errors}
            isValid={values[realField1]}
            disabled={isSubmitting || disableInputs || disabled}
            autoComplete="off"
            {...firstProps}
          />
        );

        return (
          <Fragment key={count || -1}>
            <div className="col-5 col-sm-5 col-md-6">
              <div data-cy="form-group">
                {labels && labels.length > 0 && (
                  <label className="form-label mb-0">{labels[0]}</label>
                )}

                {firstIsUser ? (
                  <AutoComplete
                    type={["user"]}
                    query={value1}
                    onAutocomplete={({ data }) =>
                      setFieldValue(realField1, data.name)
                    }
                  >
                    {firstField}
                    <div className="invalid-feedback">{errors[realField1]}</div>
                  </AutoComplete>
                ) : (
                  <>
                    {firstField}
                    <div className="invalid-feedback">{errors[realField1]}</div>
                  </>
                )}
              </div>
            </div>

            <div className="col-5 col-sm-5 col-md-5">
              {!(omitFirstOptional && i === 0) && (
                <div data-cy="form-group">
                  {labels && labels.length > 1 && (
                    <label className="form-label mb-0">{labels[1]}</label>
                  )}
                  <Input
                    name={realField2}
                    type="text"
                    value={value2}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched[topLevelField2] && realField2 in errors}
                    isValid={value2}
                    disabled={isSubmitting || disableInputs || disabled}
                    autoComplete="off"
                    {...secondProps}
                  />
                  <div className="invalid-feedback">{errors[realField2]}</div>
                </div>
              )}
            </div>

            <div className="col-auto col-sm-2 col-md-1">
              {(optional || i > 0) && (
                <div>
                  <button
                    type="button"
                    className={`btn btn-danger width-auto ${stylesFrmMap.map_form_rm_field}`}
                    onClick={(_e) =>
                      setValues({
                        ...values,
                        [name]: values[name].filter((_v, idx) => idx !== i),
                      })
                    }
                    data-cy="btn-remove-field"
                  >
                    <i className="bi bi-dash" />
                  </button>
                </div>
              )}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
