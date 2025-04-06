"use client";
import cssDangerZone from "./DangerZone.module.css";
import { FormikContext } from "@/contexts";
import { useDiscordToken } from "@/utils/hooks";
import { Formik } from "formik";
import { useState } from "react";
import MapCodeController, { codeRegex } from "./MapCodeController";
import { botbDifficulties, difficulties } from "@/utils/maplistUtils";
import { transferCompletions } from "@/server/maplistRequests.client";
import ErrorToast from "./ErrorToast";
import { revalidateMap } from "@/server/revalidations";
import LazyModal from "../transitions/LazyModal";
import LazyToast from "../transitions/LazyToast";
import RetroMapName from "../dynamic/RetroMapName";

const defaultValues = {
  code: "",
  exists: false,
  isMaplist: false,
  mapData: null,
};

export default function FormTransferCompletion({ from }) {
  const [show, setShow] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentMap, setCurrentMap] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const token = useDiscordToken();

  const handleHide = () => setShow(false);

  return (
    <>
      <Formik
        initialValues={{ ...defaultValues }}
        validate={(values) => {
          const errors = {};
          if (values.code.length) {
            if (!codeRegex.test(values.code))
              errors.code = "Codes must be exactly 7 letters";
            else if (!values.exists) errors.code = "That map doesn't exist";
            else if (!values.isMaplist)
              errors.code = "That map is not in the maplist! Insert it first!";
            else if (values.mapData?.deleted_on)
              errors.code = "That map is deleted too!";
          }
          return errors;
        }}
      >
        {(formikProps) => {
          const {
            handleSubmit,
            errors,
            setErrors,
            values,
            isSubmitting,
            setValues,
          } = formikProps;

          const disableInputs = isSubmitting;
          return (
            <FormikContext.Provider value={{ ...formikProps, disableInputs }}>
              <form onSubmit={handleSubmit} data-cy="form-transfer-completions">
                <div
                  className={`${cssDangerZone.danger_zone} mt-5 text-center`}
                >
                  <h2>Transfer Completions</h2>
                  <p>Transfer all completions to another map.</p>
                  <p className="muted">
                    It will only transfer completions you have privileges to
                    edit.
                  </p>

                  <div className="row d-flex justify-content-between align-items-start gy-3">
                    <div className="col-12 col-md-4">
                      <MapCodeController
                        noLabels
                        name="code"
                        isFetching={isFetching}
                        setIsFetching={setIsFetching}
                        currentMap={currentMap}
                        onMapSuccess={({ mapData, isMaplist }) => {
                          const code = isMaplist ? mapData.code : mapData.id;
                          setCurrentMap(code);
                          setValues(
                            {
                              code,
                              exists: true,
                              isMaplist,
                              mapData: isMaplist ? mapData : null,
                            },
                            true
                          );
                        }}
                        onMapFail={(code) => {
                          setValues(
                            {
                              code,
                              exists: false,
                              isMaplist: false,
                              mapData: null,
                            },
                            true
                          );
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-4 d-flex justify-content-center">
                      <button
                        type="button"
                        className="btn btn-danger big mb-1"
                        onClick={() => setShow(true)}
                        disabled={
                          disableInputs ||
                          !values.exists ||
                          !values.isMaplist ||
                          errors.code
                        }
                        data-cy="btn-transfer"
                      >
                        Transfer
                      </button>
                    </div>
                  </div>

                  {values.mapData && (
                    <TransferMapDescription {...values.mapData} />
                  )}
                </div>

                <LazyModal
                  className="modal-panel"
                  show={show}
                  onHide={handleHide}
                >
                  <div className="modal-body text-center">
                    <h2>Transfer Completions?</h2>
                    <p>
                      {values.mapData && (
                        <TransferMapDescription {...values.mapData} />
                      )}
                    </p>
                    <div className="d-flex justify-content-between">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleHide}
                        disabled={disableInputs}
                        data-cy="btn-cancel"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger big"
                        disabled={disableInputs}
                        onClick={async () => {
                          const response = await transferCompletions(
                            token.access_token,
                            from,
                            values.code
                          );
                          if (response && Object.keys(response.errors).length)
                            return setErrors(response.errors);
                          setSuccess(true);
                          setCurrentMap(null);
                          setValues({ ...defaultValues }, true);
                          revalidateMap(values.code);
                          revalidateMap(from);
                          handleHide();
                        }}
                        data-cy="btn-transfer-confirm"
                      >
                        Transfer
                      </button>
                    </div>
                  </div>
                </LazyModal>
              </form>

              <ErrorToast />
            </FormikContext.Provider>
          );
        }}
      </Formik>

      <LazyToast
        bg="success"
        className="notification"
        show={success}
        onClose={() => setSuccess(false)}
        delay={4000}
        autohide
      >
        <div className="toast-body">Completions transferred successfully!</div>
      </LazyToast>
    </>
  );
}

function TransferMapDescription({
  placement_curver,
  difficulty,
  botb_difficulty,
  remake_of,
  code,
  name,
}) {
  return (
    <div className="text-start">
      <p className="mt-3 mb-1">
        Transfer completions to{" "}
        <a target="_blank" href={`/map/${code}`}>
          {name}
        </a>
      </p>
      <ul>
        {placement_curver !== null && (
          <li>Maplist placement: #{placement_curver}</li>
        )}
        {difficulty !== null && (
          <li>
            Difficulty:{" "}
            {difficulties.find(({ value }) => value === difficulty).name} Expert
          </li>
        )}
        {botb_difficulty !== null && (
          <li>
            BotB Difficulty:{" "}
            {
              botbDifficulties.find(({ value }) => value === botb_difficulty)
                .name
            }{" "}
          </li>
        )}
        {remake_of !== null && (
          <li>Nostalgia Pack Remake Of: {remake_of.name}</li>
        )}
      </ul>
    </div>
  );
}
