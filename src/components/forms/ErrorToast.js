"use client";
import { FormikContext } from "@/contexts";
import { useContext, useEffect, useState } from "react";
import { Toast } from "react-bootstrap";

export default function ErrorToast() {
  const { errors, setErrors } = useContext(FormikContext);
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
    <Toast
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
      <Toast.Body>{errors[""] || currentErr}</Toast.Body>
    </Toast>
  );
}
