"use client";
import dynamic from "next/dynamic";
import { selectMaplistProfile } from "@/features/authSlice";
import { useAppSelector } from "@/lib/store";
import { useDiscordToken } from "@/utils/hooks";
import { useEffect, useState } from "react";
import { Formik } from "formik";
import CheckBox from "../forms/bootstrap/CheckBox";
const LazyModal = dynamic(() => import("../transitions/LazyModal"), {
  ssr: false,
});

export default function RulesFirstTimePopup() {
  const [show, setShow] = useState(false);
  const { maplistProfile } = useAppSelector(selectMaplistProfile);
  const token = useDiscordToken();
  const showModal =
    show && maplistProfile && !maplistProfile.has_seen_popup && token;

  useEffect(() => setShow(true), []);

  const handleClose = () => {
    setShow(false);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/read-rules`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
  };

  return (
    <LazyModal
      show={showModal}
      backdrop="static"
      onHide={handleClose}
      size="lg"
      className="modal-panel"
      keyboard={false}
      centered
    >
      <div className="modal-body">
        <h2 className="text-center">Welcome to the BTD6 Maplist!</h2>
        <p className="text-justify">
          Before you submit completions or maps, remember that there are RULES
          for your run or map to be accepted.&nbsp;
          <span className="text-warning">You should read them!</span> They're a
          ~3 minute read.
          <br />
          <br />
          You can find them anytime at the bottom of any page, or at the top of
          any submission page.&nbsp;
          <span className="text-warning">
            If you submit something without reading them first, it might not be
            accepted!
          </span>
        </p>

        <Formik
          onSubmit={handleClose}
          validate={(values) => {
            const errors = {};
            if (!values.knowsExist)
              errors.knowsExist = "Please check that you know the rules exist.";
            if (!values.willRead)
              errors.willRead = "Please check that you will read them.";
            return errors;
          }}
          initialValues={{
            knowsExist: false,
            willRead: false,
          }}
        >
          {({ values, errors, touched, handleSubmit, handleChange }) => (
            <form onSubmit={handleSubmit}>
              <CheckBox
                name="knowsExist"
                onChange={handleChange}
                isInvalid={touched.knowsExist && !!errors.knowsExist}
                value={values.knowsExist}
                label="I am aware that rules exist"
              />

              <CheckBox
                name="willRead"
                onChange={handleChange}
                isInvalid={touched.willRead && !!errors.willRead}
                value={values.willRead}
                label="I will read them before submitting anything"
              />

              <div className="flex-hcenter mt-3">
                <button type="submit" className="btn btn-primary active">
                  Understood
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </LazyModal>
  );
}
