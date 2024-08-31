"use client";
import { Formik } from "formik";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDiscordToken } from "@/utils/hooks";
import { FormikContext } from "@/contexts";
import MapCodeController, { codeRegex } from "./MapCodeController";
import Btd6Map from "../maps/Btd6Map";
import SelectorButton from "../buttons/SelectorButton";

const MAX_TEXT_LEN = 500;

export default function SubmitMapForm({ onSubmit }) {
  const [currentMap, setCurrentMap] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [showErrorCount, setShowErrorCount] = useState(false);
  const [success, setSuccess] = useState(false);
  const accessToken = useDiscordToken();

  onSubmit = onSubmit || (async () => {});

  if (!accessToken) return null;

  const validate = async (values) => {
    const errors = {};
    if (!codeRegex.test(values.code))
      errors.code = "Codes must be exactly 7 letters";

    if (values.notes.length > MAX_TEXT_LEN)
      errors.notes = `Keep it under ${MAX_TEXT_LEN} characters!`;

    return errors;
  };

  const handleSubmit = async (values, { setErrors }) => {
    const code = values.code.match(codeRegex)[1].toUpperCase();
    payload = { code };

    console.log(values);
    return;

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
        beat_proof: "",
      }}
      onSubmit={handleSubmit}
    >
      {(formikProps) => {
        const {
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          touched,
          errors,
          setErrors,
          isSubmitting,
        } = formikProps;

        let errorCount = Object.keys(errors).length;
        const disableInputs = isFetching || isSubmitting;

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

              {currentMap && currentMap.valid && (
                <>
                  <hr className="mb-5" />

                  <div className="row flex-row-space mt-5">
                    <div className="col-12 col-lg-6">
                      <Btd6Map
                        code={values.code}
                        name={currentMap.name}
                        className="my-0"
                      />
                    </div>

                    <div className="col-12 col-lg-6">
                      <div className="panel h-100">
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
                              List Position
                            </p>
                            <div className="align-self-end">
                              <Form.Select
                                name="proposed"
                                value={values.proposed}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              >
                                <option value="0">Top 3</option>
                                <option value="1">Top 10</option>
                                <option value="2">#11~20</option>
                                <option value="3">#21~30</option>
                                <option value="4">#31~40</option>
                                <option value="5">#41~50</option>
                              </Form.Select>
                            </div>
                          </div>

                          <div className="d-flex w-100 justify-content-between mt-3">
                            <p className="my-0 align-self-center">
                              Proof of completion
                            </p>
                            <div className="align-self-end">
                              <Form.Control
                                type="url"
                                name="beat_proof"
                                value={values.beat_proof}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={
                                  touched.beat_proof &&
                                  (values.beat_proof.length === 0 ||
                                    "beat_proof" in errors)
                                }
                              />
                            </div>
                          </div>
                          <p className="muted text-center">
                            URL to an image of you beating Round 100 CHIMPs on
                            your own map
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

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
            </Form>
          </FormikContext.Provider>
        );
      }}
    </Formik>
  );
}
