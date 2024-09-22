"use client";
import {
  selectMaplistProfile,
  setBtd6Profile,
  setMinMaplistProfile,
} from "@/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { Collapse, Toast } from "react-bootstrap";
import { Formik } from "formik";
import { editProfile } from "@/server/maplistRequests.client";
import { getBtd6User } from "@/server/ninjakiwiRequests";
import { revalidateUser } from "@/server/revalidations";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDiscordToken } from "@/utils/hooks";
import Input from "@/components/forms/bootstrap/Input";

const MAX_NAME_LEN = 100;

export default function EditSelf_C() {
  const { maplistProfile } = useAppSelector(selectMaplistProfile);
  const { access_token } = useDiscordToken();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showOakHelp, setShowOakHelp] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = async (values) => {
    const errors = {};
    if (!values.name.length) errors.name = "Name cannot be blank";
    else if (values.name.length > MAX_NAME_LEN)
      errors.name = "Name is too long";
    else if (!/^[a-zA-Z0-9\._-]+$/.test(values.name))
      errors.name = 'Name can only have alphanumeric characters or "_-."';

    if (values.oak.length) {
      if (!values.oak.startsWith("oak_"))
        errors.oak = (
          <>
            OAK must start with <span className="mono">oak_...</span>
          </>
        );
      else if (values.oak.length !== 24)
        errors.oak = `OAK must be exactly 24 characters long (yours is ${values.oak.length})`;
    }

    return errors;
  };

  const handleSubmit = async (values, { setErrors }) => {
    const result = await editProfile(access_token, maplistProfile.id, values);

    if (Object.keys(result.errors).length) {
      setErrors(result.errors);
      return;
    }

    setSuccess(true);
    revalidateUser(maplistProfile.id);
    if (values.oak.length && values.oak !== maplistProfile.oak) {
      const btd6Profile = await getBtd6User(values.oak);
      dispatch(setBtd6Profile({ btd6Profile }));
    }
    dispatch(setMinMaplistProfile({ ...result.data }));
  };

  return (
    <>
      <h1 className="text-center">Edit Profile</h1>

      <Formik
        onSubmit={handleSubmit}
        validate={validate}
        initialValues={{
          name: maplistProfile.name,
          oak: maplistProfile.oak || "",
        }}
      >
        {({ handleSubmit, handleChange, values, errors, isSubmitting }) => (
          <form noValidate onSubmit={handleSubmit}>
            <div className="panel panel-container">
              <div className="row flex-row-space">
                <div className="col-5 col-sm-6">
                  <p>Username</p>
                </div>
                <div className="col-7 col-sm-6">
                  <div>
                    <Input
                      name="name"
                      type="text"
                      placeholder="chimenea.mo"
                      value={values.name}
                      onChange={handleChange}
                      isInvalid={"name" in errors}
                      disabled={isSubmitting}
                      autocomplete="off"
                    />
                    <div className="invalid-feedback">{errors.name}</div>
                  </div>
                </div>

                <div className="col-5 col-sm-6">
                  <p>NinjaKiwi OAK</p>
                </div>
                <div className="col-7 col-sm-6">
                  <div>
                    <Input
                      type="text"
                      name="oak"
                      placeholder="oak_b1B..."
                      value={values.oak}
                      onChange={handleChange}
                      isInvalid={"oak" in errors}
                      disabled={isSubmitting}
                      autocomplete="off"
                    />
                    <div className="invalid-feedback">{errors.oak}</div>
                  </div>
                </div>
                <div className="col-12">
                  <p className="muted text-center mb-2">
                    <a
                      href="https://support.ninjakiwi.com/hc/en-us/articles/13438499873937-Open-Data-API"
                      target="_blank"
                    >
                      NinjaKiwi OAKs &nbsp;
                      <i className="bi bi-box-arrow-up-right" />
                    </a>{" "}
                    (OpenData API Keys) are used to give you your in-game
                    profile picture and banner. You can generate one inside of
                    BTD6 very easily.
                  </p>
                  <div className="d-flex justify-content-center">
                    <button
                      onClick={(_e) => setShowOakHelp(!showOakHelp)}
                      className="btn btn-primary fs-6 mb-3"
                    >
                      How do I get mine?
                    </button>
                  </div>
                  <Collapse in={showOakHelp}>
                    <div>
                      <p className="text-center">
                        Open BTD6 and go into the settings, then click{" "}
                        <b>
                          <u>Account</u>
                        </b>
                      </p>
                      <div className="d-flex justify-content-center">
                        <img
                          src="https://i.imgur.com/FurlzfB.png"
                          className="mb-3 opendata-guide"
                        />
                      </div>

                      <p className="text-center">
                        Click{" "}
                        <b>
                          <u>Open Data API</u>
                        </b>{" "}
                        on the bottom right
                      </p>
                      <div className="d-flex justify-content-center">
                        <img
                          src="https://i.imgur.com/tCqlDYj.png"
                          className="mb-3 opendata-guide"
                        />
                      </div>

                      <p className="text-center">
                        Click{" "}
                        <b>
                          <u>Generate New Key</u>
                        </b>{" "}
                        and then you can copy it and you're done!
                      </p>
                      <div className="d-flex justify-content-center">
                        <img
                          src="https://i.imgur.com/owhXl4U.png"
                          className="mb-3 opendata-guide"
                        />
                      </div>
                    </div>
                  </Collapse>
                </div>
              </div>
            </div>

            <div className="d-flex flex-col-space justify-content-center">
              <button
                className="btn btn-primary"
                disabled={isSubmitting}
                onClick={(_e) =>
                  router.push(`/user/${maplistProfile.id}`, { scroll: false })
                }
              >
                Back
              </button>
              <button
                className="btn btn-primary"
                disabled={isSubmitting}
                type="submit"
              >
                Save
              </button>
            </div>
          </form>
        )}
      </Formik>

      <Toast
        bg="success"
        className="notification"
        show={success}
        onClose={() => setSuccess(false)}
        delay={4000}
        autohide
      >
        <Toast.Body>Profile changed successfully!</Toast.Body>
      </Toast>
    </>
  );
}
