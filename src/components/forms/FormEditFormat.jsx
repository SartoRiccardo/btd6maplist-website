"use client";
import { editFormat, getFormat } from "@/server/maplistRequests.client";
import { useDiscordToken } from "@/utils/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import ToastSuccess from "./ToastSuccess";
import { Formik } from "formik";
import Input from "./bootstrap/Input";
import CheckBox from "./bootstrap/CheckBox";
import Select from "./bootstrap/Select";
import { useDispatch } from "react-redux";
import { setFormat } from "@/features/maplistSlice";
import ErrorToast from "./ErrorToast";
import { revalidateTag } from "next/cache";

const mapSubmStatuses = [
  { name: "open", label: "Open" },
  { name: "closed", label: "Closed" },
];

const runSubmStatuses = [
  { name: "open", label: "Open" },
  { name: "closed", label: "Closed" },
  { name: "lcc_only", label: "LCCs Only" },
];

const getInitialValues = (format) => ({
  map_submission_wh: format?.map_submission_wh || "",
  run_submission_wh: format?.run_submission_wh || "",
  hidden: format?.hidden,
  run_submission_status: format?.run_submission_status,
  map_submission_status: format?.map_submission_status,
  emoji: format?.emoji || "",
});

const validate = (values) => {
  const errors = {};
  return errors;
};

export default function FormEditFormat({ formatId }) {
  const [curFormat, setCurFormat] = useState(null);
  const formatCache = useRef({});
  const [success, setSuccess] = useState(false);
  const accessToken = useDiscordToken();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFormat = async () => {
      if (!(formatId in formatCache)) {
        formatCache[formatId] = await getFormat(
          accessToken.access_token,
          formatId
        );
      }
      setCurFormat(formatCache[formatId]);
    };

    setCurFormat(null);
    fetchFormat();
  }, [formatId]);

  const handleSubmit = useCallback(async (values, { setErrors }) => {
    values = {
      ...values,
      map_submission_wh:
        values.map_submission_wh === "" ? null : values.map_submission_wh,
      run_submission_wh:
        values.run_submission_wh === "" ? null : values.run_submission_wh,
    };

    const result = await editFormat(
      accessToken.access_token,
      curFormat.id,
      values
    );
    if (result && Object.keys(result.errors).length) {
      setErrors(result.errors);
      return;
    }

    dispatch(
      setFormat({
        format: { id: curFormat.id, name: curFormat.name, ...values },
      })
    );
    setSuccess(true);
    revalidateTag("formats");
  });

  return (
    <>
      <Formik
        onSubmit={handleSubmit}
        validate={validate}
        initialValues={getInitialValues(curFormat)}
        key={curFormat?.id}
      >
        {({
          handleSubmit,
          handleChange,
          values,
          isSubmitting,
          errors,
          setErrors,
        }) => {
          const disableInputs = curFormat === null || isSubmitting;

          return (
            <>
              <form onSubmit={handleSubmit} data-cy="config-form">
                <div className="panel panel-container">
                  <h2 className="text-center">List Information</h2>

                  <div className="row gy-2">
                    <div className="col-12">
                      <CheckBox
                        type="checkbox"
                        name="hidden"
                        onChange={handleChange}
                        value={values.hidden}
                        checked={values.hidden}
                        disabled={disableInputs}
                        label="Hide this list"
                      />
                    </div>

                    <div className="col-5 col-sm-6">
                      <p className="mb-0">Map Submissions</p>
                    </div>
                    <div className="col-7 col-sm-6">
                      <Select
                        name="map_submission_status"
                        value={values.map_submission_status}
                        disabled={disableInputs}
                        onChange={handleChange}
                      >
                        {mapSubmStatuses.map(({ name, label }) => (
                          <option key={name} value={name}>
                            {label}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div className="col-5 col-sm-6">
                      <p className="mb-0">Run Submissions</p>
                    </div>
                    <div className="col-7 col-sm-6">
                      <Select
                        name="run_submission_status"
                        value={values.run_submission_status}
                        disabled={disableInputs}
                        onChange={handleChange}
                      >
                        {runSubmStatuses.map(({ name, label }) => (
                          <option key={name} value={name}>
                            {label}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <h4 className="text-center mt-3 mb-1">
                      Crosspost to Discord
                    </h4>
                    <p>
                      You can make submissions be posted in Discord channels by
                      creating a <b>webhook</b>. You can create one by going to
                      your server's{" "}
                      <b>Settings &gt; Integrations &gt; Webhooks.</b>
                      <br />
                      After creating one and setting a profile picture, a name,
                      and the channel it's going to post in, copy the Webhook
                      URL and paste it here.
                    </p>
                    <div className="col-5 col-sm-6">
                      <p className="mb-0">Map Submission Webhook</p>
                    </div>
                    <div className="col-7 col-sm-6">
                      <Input
                        name="map_submission_wh"
                        type="url"
                        value={values.map_submission_wh}
                        onChange={handleChange}
                        placeholder={"https://discord.com/api/webhooks/..."}
                        disabled={disableInputs}
                      />
                    </div>

                    <div className="col-5 col-sm-6">
                      <p className="mb-0">Run Submission Webhook</p>
                    </div>
                    <div className="col-7 col-sm-6">
                      <Input
                        name="run_submission_wh"
                        type="url"
                        value={values.run_submission_wh}
                        onChange={handleChange}
                        placeholder={"https://discord.com/api/webhooks/..."}
                        disabled={disableInputs}
                      />
                    </div>
                  </div>

                  <div className="d-flex flex-col-space justify-content-center mt-3">
                    <button
                      className="btn btn-primary"
                      disabled={disableInputs}
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>

              <ErrorToast errors={errors} setErrors={setErrors} />
            </>
          );
        }}
      </Formik>

      <ToastSuccess show={success} onClose={() => setSuccess(false)}>
        Format information modified successfully!
      </ToastSuccess>
    </>
  );
}
