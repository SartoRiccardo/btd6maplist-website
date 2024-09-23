"use client";
import { FormikContext } from "@/contexts";
import { useContext, useState } from "react";

export default function AddableField({
  name,
  defaultValue,
  children,
  disabled,
  firstId,
}) {
  const [count, setCount] = useState(firstId || 1);
  const formikProps = useContext(FormikContext);
  const { setValues, values } = formikProps;

  return (
    <>
      {children}

      <div className="flex-hcenter mt-3">
        <button
          type="button"
          className="btn btn-success"
          disabled={disabled}
          onClick={(_e) => {
            setValues({
              ...values,
              [name]: [...values[name], { ...defaultValue, count }],
            });
            setCount(count + 1);
          }}
        >
          <i className="bi bi-plus-lg" />
        </button>
      </div>
    </>
  );
}
