"use client";
import {
  selectDiscordAccessToken,
  selectMaplistProfile,
  setBtd6Profile,
  setMinMaplistProfile,
} from "@/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { Button, Form } from "react-bootstrap";
import { Formik } from "formik";
import { editProfile } from "@/server/maplistRequests";
import { getBtd6User } from "@/server/ninjakiwiRequests";
import { revalidateUser } from "@/server/revalidations";
import { useRouter } from "next/navigation";

export default function EditSelf() {
  const { maplistProfile } = useAppSelector(selectMaplistProfile);
  const { access_token } = useAppSelector(selectDiscordAccessToken);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const validate = async (values) => {
    const errors = {};
    if (!values.name.length) errors.name = "Name cannot be blank";
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

    revalidateUser(maplistProfile.id);
    if (values.oak.length && values.oak !== maplistProfile.oak) {
      const btd6Profile = await getBtd6User(values.oak);
      dispatch(setBtd6Profile({ btd6Profile }));
    }
    dispatch(setMinMaplistProfile({ ...result.data }));
  };

  return (
    <>
      <title>Edit Profile | BTD6 Maplist</title>

      <h1 className="text-center">Edit Profile</h1>

      <Formik
        onSubmit={handleSubmit}
        validate={validate}
        initialValues={{
          name: maplistProfile.name,
          oak: maplistProfile.oak || "",
        }}
        validateOnBlur
      >
        {({ handleSubmit, handleChange, values, errors, isSubmitting }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <div className="panel my-3 py-3">
              <div className="row flex-row-space">
                <div className="col-6">
                  <p>Username</p>
                </div>
                <div className="col-6">
                  <Form.Group>
                    <Form.Control
                      name="name"
                      type="text"
                      placeholder="chimenea.mo"
                      value={values.name}
                      onChange={handleChange}
                      isInvalid={"name" in errors}
                      disabled={isSubmitting}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>

                <div className="col-6">
                  <p>NinjaKiwi OAK</p>
                </div>
                <div className="col-6">
                  <Form.Group>
                    <Form.Control
                      type="text"
                      name="oak"
                      placeholder="oak_b1B..."
                      value={values.oak}
                      onChange={handleChange}
                      isInvalid={"oak" in errors}
                      disabled={isSubmitting}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.oak}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
              </div>
            </div>

            <div className="d-flex flex-col-space justify-content-center">
              <Button
                disabled={isSubmitting}
                onClick={(_e) =>
                  router.push(`/user/${maplistProfile.id}`, { scroll: false })
                }
              >
                Back
              </Button>
              <Button disabled={isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
