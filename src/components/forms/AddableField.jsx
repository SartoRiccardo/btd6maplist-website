"use client";
import { FormikContext } from "@/contexts";
import { useCallback, useContext, useState } from "react";

export default function AddableField({
  name,
  defaultValue,
  children,
  disabled,
  firstId,
  maxAmount,
  currentAmount,
  w100,
  addFieldsBtn,
}) {
  maxAmount = maxAmount || 0;
  currentAmount = currentAmount || 0;

  const [count, setCount] = useState(firstId || 1);
  const formikProps = useContext(FormikContext);
  const { setValues, values } = formikProps;

  const addValue = useCallback(
    (_e) => {
      setValues({
        ...values,
        [name]: [...values[name], { ...defaultValue, count }],
      });
      setCount(count + 1);
    },
    [values, count, name, defaultValue]
  );

  return (
    <div data-cy="addable-field" data-cy-name={name}>
      {children}
      {(maxAmount === 0 || currentAmount < maxAmount) &&
        (addFieldsBtn ? (
          addFieldsBtn({ addValue })
        ) : (
          <div className={`flex-hcenter mt-3 ${w100 ? "w-100" : ""}`}>
            <button
              type="button"
              className={`btn btn-success ${w100 ? "w-100" : ""}`}
              disabled={disabled}
              onClick={addValue}
              data-cy="btn-addable-field"
            >
              <i className="bi bi-plus-lg" />
            </button>
          </div>
        ))}
    </div>
  );
}
