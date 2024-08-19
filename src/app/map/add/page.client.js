"use client";
import "./newmap.css";
import { getCustomMap } from "@/server/ninjakiwiRequests";
import { Formik } from "formik";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useAppSelector } from "@/lib/store";
import { selectMaplistProfile } from "@/features/authSlice";
import { selectMaplistConfig } from "@/features/maplistSlice";
import { difficulties } from "@/utils/maplistUtils";

const MAX_NAME_LEN = 100;
const MAX_URL_LEN = 300;

export default function MapForm_C({ initialValues, code }) {
  const [currentMap, setCurrentMap] = useState(
    code ? { code, valid: true } : null
  );
  const { maplistProfile } = useAppSelector(selectMaplistProfile);
  const maplistCfg = useAppSelector(selectMaplistConfig);

  const validate = async (values) => {
    const errors = {};
    if (
      values.code.length !== 7 &&
      !/^https:\/\/join\.btd6\.com\/Map\/[A-Z]{7}$/.test(values.code)
    ) {
      errors.code = "Codes must be 7 characters long";
    } else {
      const code =
        values.code.length === 7
          ? values.code.toUpperCase()
          : values.code.match(
              /^https:\/\/join\.btd6\.com\/Map\/([A-Z]{7})$/
            )[1];

      if (!currentMap || currentMap.code !== code) {
        setCurrentMap({ code, valid: !!(await getCustomMap(code)) });
      }
    }

    if (!values.name.length) {
      errors.name = "Name cannot be blank";
    } else if (values.name.length > MAX_NAME_LEN) {
      errors.name = "Name is too long";
    }

    if (
      values.placement_curver.toString().length &&
      (values.placement_curver <= 0 ||
        values.placement_curver > maplistCfg.map_count)
    )
      errors.placement_curver = `Must be between 1 and ${maplistCfg.map_count}`;

    if (
      values.placement_allver.toString().length &&
      (values.placement_allver <= 0 ||
        values.placement_allver > maplistCfg.map_count)
    )
      errors.placement_allver = `Must be between 1 and ${maplistCfg.map_count}`;

    return errors;
  };

  const handleSubmit = async (values) => {
    const code =
      values.code.length === 7
        ? values.code.toUpperCase()
        : values.code.match(/^https:\/\/join\.btd6\.com\/Map\/([A-Z]{7})$/)[1];

    console.log({ ...values, code });
  };

  return (
    <Formik
      validate={validate}
      initialValues={
        initialValues || {
          code: "",
          name: "",
          placement_curver: "",
          placement_allver: "",
          difficulty: "-1",
          r6_start: "",
          map_data: "",
          map_data_req_permission: false,
        }
      }
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, handleChange, values, errors, isSubmitting }) => {
        return (
          <Form onSubmit={handleSubmit} key={0}>
            <Form.Group className="mapcode-input">
              <Form.Label>Map Code</Form.Label>
              <Form.Control
                name="code"
                type="text"
                placeholder={"CHIMENE"}
                value={values.code}
                onChange={handleChange}
                isInvalid={values.code.length === 0 || "code" in errors}
                isValid={!("code" in errors)}
                disabled={isSubmitting}
                autoComplete="off"
              />
              <Form.Control.Feedback type="invalid">
                {errors.code}
              </Form.Control.Feedback>
            </Form.Group>

            <p className="muted text-center">
              You can also paste the whole map share URL
            </p>

            {currentMap && currentMap.valid && (
              <>
                <hr className="mb-5" />

                <div className="row flex-row-space mt-5">
                  <div className="col-12 col-lg-6">
                    <div className="panel pt-3 px-3 pb-4 map-preview">
                      <div className="map-name-container">
                        <Form.Group>
                          <Form.Control
                            name="name"
                            type="text"
                            placeholder={"chimene.mo's map"}
                            value={values.name}
                            onChange={handleChange}
                            isInvalid={
                              values.name.length === 0 || "name" in errors
                            }
                            isValid={!("name" in errors)}
                            disabled={isSubmitting}
                            autoComplete="off"
                          />
                        </Form.Group>
                      </div>

                      <img
                        className="w-100"
                        src={`https://data.ninjakiwi.com/btd6/maps/map/${currentMap.code}/preview`}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-lg-6">
                    <div className="panel h-100">
                      <div className="row flex-row-space my-3">
                        {maplistProfile.roles.includes(
                          process.env.NEXT_PUBLIC_LISTMOD_ROLE
                        ) && (
                          <>
                            <div className="col-6 col-lg-7">
                              <p>List Placement</p>
                            </div>
                            <div className="col-6 col-lg-5">
                              <Form.Group>
                                <Form.Control
                                  name="placement_curver"
                                  type="number"
                                  placeholder="N/A"
                                  value={values.placement_curver}
                                  onChange={handleChange}
                                  isInvalid={"placement_curver" in errors}
                                  isValid={
                                    !("placement_curver" in errors) &&
                                    values.placement_curver
                                  }
                                  disabled={isSubmitting}
                                  autoComplete="off"
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.placement_curver}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </div>

                            <div className="col-6 col-lg-7">
                              <p>List Placement (All Versions)</p>
                            </div>
                            <div className="col-6 col-lg-5">
                              <Form.Group>
                                <Form.Control
                                  name="placement_allver"
                                  type="number"
                                  placeholder="N/A"
                                  value={values.placement_allver}
                                  onChange={handleChange}
                                  isInvalid={"placement_allver" in errors}
                                  isValid={
                                    !("placement_allver" in errors) &&
                                    values.placement_allver
                                  }
                                  disabled={isSubmitting}
                                  autoComplete="off"
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.placement_allver}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </div>
                          </>
                        )}

                        {maplistProfile.roles.includes(
                          process.env.NEXT_PUBLIC_EXPMOD_ROLE
                        ) && (
                          <>
                            <div className="col-6 col-lg-7">
                              <p>Expert Difficulty</p>
                            </div>
                            <div className="col-6 col-lg-5">
                              <Form.Select
                                name="difficulty"
                                value={values.difficulty}
                                onChange={handleChange}
                                disabled={isSubmitting}
                              >
                                <option value="-1">N/A</option>
                                {difficulties.map(({ name, value }) => (
                                  <option key={value} value={value}>
                                    {name} Expert
                                  </option>
                                ))}
                              </Form.Select>
                            </div>
                          </>
                        )}

                        <div className="col-6 col-lg-7">
                          <p>Map Data</p>
                        </div>
                        <div className="col-6 col-lg-5">
                          <Form.Group>
                            <Form.Control
                              name="map_data"
                              type="text"
                              placeholder="https://drive.google.com/..."
                              value={
                                values.map_data_req_permission
                                  ? ""
                                  : values.map_data
                              }
                              onChange={handleChange}
                              isInvalid={"map_data" in errors}
                              isValid={
                                !("map_data" in errors) &&
                                values.map_data &&
                                !values.map_data_req_permission
                              }
                              disabled={
                                isSubmitting || values.map_data_req_permission
                              }
                              autoComplete="off"
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.placement_curver}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Check
                              name="map_data_req_permission"
                              checked={values.map_data_req_permission}
                              onChange={handleChange}
                              label="Should ask permission to the creator"
                              disabled={isSubmitting}
                            />
                          </Form.Group>
                        </div>

                        <div className="col-6 col-lg-7">
                          <p>Round 6 start image/video</p>
                        </div>
                        <div className="col-6 col-lg-5">
                          <Form.Group>
                            <Form.Control
                              name="r6_start"
                              type="text"
                              placeholder="https://imgur.com/..."
                              value={values.r6_start}
                              onChange={handleChange}
                              isInvalid={"r6_start" in errors}
                              isValid={
                                !("r6_start" in errors) && values.r6_start
                              }
                              disabled={isSubmitting}
                              autoComplete="off"
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.r6_start}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </div>
                        <p className="muted text-center">
                          Please don't upload Discord URLs. Upload the image to{" "}
                          <a href="https://imgur.com/" target="_blank">
                            Imgur
                          </a>{" "}
                          first or another site like that.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-hcenter mt-5">
                  <Button type="submit" disabled={isSubmitting}>
                    Submit
                  </Button>
                </div>
              </>
            )}
          </Form>
        );
      }}
    </Formik>
  );
}
