"use client";
import { FormikContext } from "@/contexts";
import { useContext, useEffect, useState } from "react";
import LazyToast from "../transitions/LazyToast";

export default function ErrorToast({ errors, setErrors }) {
  const formikContext = useContext(FormikContext);
  errors = errors === undefined ? formikContext.errors : errors;
  setErrors = setErrors === undefined ? formikContext.setErrors : setErrors;
  const [currentErr, setCurrentErr] = useState(null);
  const [show, setShow] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (errors[""]) {
      setCurrentErr(errors[""]);
      setShow(true);
      setKey(key + 1);
    }
  }, [errors[""]]);

  return (
    <LazyToast
      bg="danger"
      className="notification"
      show={show}
      key={key}
      onClose={() => {
        const newErr = { ...errors };
        delete newErr[""];
        setErrors(newErr);
        setShow(false);
      }}
      delay={7000}
      autohide
    >
      <div className="toast-body" data-cy="toast-error">
        {errors[""] || currentErr}
      </div>
    </LazyToast>
  );
}
