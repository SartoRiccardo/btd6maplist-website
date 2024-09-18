"use client";
import { Formik } from "formik";
import { useContext, useState } from "react";
import { Button, Fade, Form } from "react-bootstrap";
import { useDiscordToken } from "@/utils/hooks";
import { FormikContext } from "@/contexts";
import MapCodeController, { codeRegex } from "./MapCodeController";
import Btd6Map from "../maps/Btd6Map";
import DragFiles from "./DragFiles";
import Link from "next/link";
import { submitMap } from "@/server/maplistRequests.client";
import MustBeInDiscord from "../utils/MustBeInDiscord";
import { MapSubmissionRules } from "../layout/maplists/MaplistRules";

const MAX_TEXT_LEN = 500;

export default function SubmitMapForm({ onSubmit, type }) {
  onSubmit = onSubmit || submitMap;
  type = type || "list";

  const [currentMap, setCurrentMap] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [showErrorCount, setShowErrorCount] = useState(false);
  const [success, setSuccess] = useState(false);
  const [openRules, setOpenRules] = useState(false);
  const accessToken = useDiscordToken();

  if (!accessToken) return null;

  const validate = async (values) => {
    const errors = {};
    if (!codeRegex.test(values.code))
      errors.code = "Codes must be exactly 7 letters";

    if (values.notes.length > MAX_TEXT_LEN)
      errors.notes = `Keep it under ${MAX_TEXT_LEN} characters!`;

    if (!values.proof_completion.length)
      errors.proof_completion = "Upload proof of completion";

    return errors;
  };

  const handleSubmit = async (values, { setErrors }) => {
    const code = values.code.match(codeRegex)[1].toUpperCase();
    const payload = {
      code,
      type,
      notes: values.notes.length ? values.notes : null,
      proposed: parseInt(values.proposed),
      proof_completion: values.proof_completion[0].file,
    };

    const result = await onSubmit(accessToken.access_token, payload);
    if (result && Object.keys(result.errors).length) {
      setErrors(result.errors);
      return;
    }

    setSuccess(true);
  };

  return (
    <Formik
      validate={validate}
      initialValues={{
        code: "",
        notes: "",
        proposed: "0",
        proof_completion: [],
      }}
      onSubmit={handleSubmit}
    >
      {(formikProps) => {
        const { handleSubmit, values, errors, setErrors, isSubmitting } =
          formikProps;

        let errorCount = Object.keys(errors).length;
        const disableInputs = isFetching || isSubmitting || success;

        return (
          <FormikContext.Provider
            value={{ ...formikProps, disableInputs }}
            key={0}
          >
            <Form
              onSubmit={(evt) => {
                setShowErrorCount(true);
                handleSubmit(evt);
              }}
              className="addmap"
            >
              <MapCodeController
                name="code"
                isFetching={isFetching}
                setIsFetching={setIsFetching}
                currentMap={currentMap?.code}
                onMapSuccess={({ mapData, isMaplist }) => {
                  if (isMaplist) {
                    setErrors({
                      ...errors,
                      code: "The map's already in the list!",
                    });
                  }
                  setCurrentMap({
                    code: mapData.id,
                    name: mapData.name,
                    valid: !isMaplist,
                  });
                }}
                onMapFail={() =>
                  setErrors({
                    ...errors,
                    code: "No map with that code found",
                  })
                }
              />

              <MustBeInDiscord />

              <div className="flex-hcenter">
                <Button
                  onClick={() => setOpenRules(!openRules)}
                  className="fs-6"
                >
                  Map Submission Rules
                </Button>
              </div>

              <Fade in={openRules} mountOnEnter={true} unmountOnExit={true}>
                <div>
                  <br />
                  <MapSubmissionRules on={type} />
                </div>
              </Fade>

              {currentMap && currentMap.valid && (
                <>
                  <hr className="mb-5" />

                  <div className="row flex-row-space mt-5">
                    <div className="col-12 col-lg-6">
                      <Btd6Map
                        code={values.code.match(codeRegex)[1]}
                        name={currentMap.name}
                        className="my-0"
                      />
                    </div>

                    <div className="col-12 col-lg-6">
                      <div className="panel h-100">
                        {success ? (
                          <SidebarSuccess type={type} />
                        ) : (
                          <SidebarForm type={type} />
                        )}
                      </div>
                    </div>
                  </div>

                  {!success && (
                    <>
                      <div className="flex-hcenter flex-col-space mt-5">
                        <Button
                          type="submit"
                          disabled={isSubmitting || disableInputs}
                        >
                          Submit
                        </Button>
                      </div>

                      {showErrorCount && errorCount > 0 && (
                        <p className="text-center text-danger mt-3">
                          There are {errorCount} fields to compile correctly
                        </p>
                      )}
                    </>
                  )}
                </>
              )}
            </Form>
          </FormikContext.Provider>
        );
      }}
    </Formik>
  );
}

function SidebarForm({ type }) {
  const formikProps = useContext(FormikContext);
  const { handleChange, handleBlur, values, touched, errors, disableInputs } =
    formikProps;

  return (
    <div className="my-2">
      <Form.Group>
        <Form.Label>Notes</Form.Label>
        <Form.Control
          name="notes"
          as="textarea"
          rows={3}
          placeholder="Small description of the map, additional credits, etc..."
          value={values.notes}
          onChange={handleChange}
          onBlur={handleBlur}
          isInvalid={touched.notes && "notes" in errors}
          disabled={disableInputs}
          autoComplete="off"
        />
        <Form.Control.Feedback type="invalid">
          {errors.notes}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="d-flex w-100 justify-content-between mt-3">
        <p className="my-0 align-self-center">
          Proposed {type === "list" ? "List Position" : "Expert Difficulty"}
        </p>
        <div className="align-self-end">
          <Form.Select
            name="proposed"
            value={values.proposed}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            {type === "list" ? (
              <>
                <option value="0">Top 3</option>
                <option value="1">Top 10</option>
                <option value="2">#11~20</option>
                <option value="3">#21~30</option>
                <option value="4">#31~40</option>
                <option value="5">#41~50</option>
              </>
            ) : (
              <>
                <option value="0">Casual Expert</option>
                <option value="1">Casual/Medium</option>
                <option value="2">Medium Expert</option>
                <option value="3">Medium/Hard</option>
                <option value="4">Hard Expert</option>
                <option value="5">Hard/True</option>
                <option value="6">True Expert</option>
              </>
            )}
          </Form.Select>
        </div>
      </div>

      <div className="w-100 justify-content-between mt-3">
        <p className="text-center mb-0">Proof of completion</p>
        <p className="muted text-center">
          Upload an image of you beating Round 100 on your own map
        </p>
        <DragFiles
          name="proof_completion"
          formats={["jpg", "png", "webp"]}
          limit={1}
          onChange={handleChange}
          value={values.proof_completion}
          className="w-100"
        >
          {values.proof_completion.length > 0 && (
            <div className="d-flex justify-content-center">
              <img
                style={{ maxWidth: "100%" }}
                src={values.proof_completion[0].objectUrl}
              />
            </div>
          )}
        </DragFiles>
        {touched.proof_completion && errors.proof_completion && (
          <p className="text-danger text-center">{errors.proof_completion}</p>
        )}
      </div>
    </div>
  );
}

function SidebarSuccess({ type }) {
  return (
    <div className="h-100 flex-vcenter">
      <p className="text-center mb-0">
        <span className="lead">Your map has been submitted!</span>
        <br />
        <span className="muted">
          The list moderators will look at your map and add it if it gets
          approved.
        </span>
        <br />
        <Link href={type === "list" ? "/list" : "/experts"}>
          &laquo; Back to the list
        </Link>
      </p>
    </div>
  );
}
