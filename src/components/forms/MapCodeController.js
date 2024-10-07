"use client";
import { FormikContext } from "@/contexts";
import { getMap } from "@/server/maplistRequests.client";
import { getCustomMap } from "@/server/ninjakiwiRequests";
import { useContext, useEffect } from "react";
import { Form } from "react-bootstrap";

export const codeRegex =
  /^(?:https:\/\/join\.btd6\.com\/Map\/|https:\/\/data\.ninjakiwi\.com\/btd6\/maps\/map\/)?([(A-Za-z]{7})$/;

export default function MapCodeController({
  name,
  currentMap,
  isFetching,
  setIsFetching,
  onMapSuccess,
  onMapFail,
  noLabels,
  notRequired,
}) {
  const formikProps = useContext(FormikContext);
  const {
    errors,
    values,
    touched,
    handleBlur,
    handleChange,
    isSubmitting,
    disableInputs,
  } = formikProps;

  useEffect(() => {
    const codeMatch = values[name].match(codeRegex);
    if (!codeMatch || errors[name] || isFetching) return;
    const code = codeMatch[1].toUpperCase();

    const fetchMap = async () => {
      // TODO handle race conditions
      if (setIsFetching) setIsFetching(true);
      const [customMap, maplistMap] = await Promise.all([
        getCustomMap(code),
        getMap(code),
      ]);
      if (maplistMap && onMapSuccess)
        onMapSuccess({ mapData: maplistMap, isMaplist: true });
      else if (customMap && onMapSuccess)
        onMapSuccess({ mapData: customMap, isMaplist: false });
      else if (onMapFail) onMapFail(code);
      if (setIsFetching) setIsFetching(false);
    };

    if (currentMap !== code) fetchMap();
  }, [errors[name], values[name]]);

  return (
    <>
      <Form.Group className="mapcode-input">
        {!noLabels && <Form.Label>Map Code</Form.Label>}
        <Form.Control
          name={name}
          type="text"
          placeholder="ZFMOOKU"
          value={values[name]}
          onChange={handleChange}
          onBlur={handleBlur}
          isInvalid={
            touched[name] &&
            ((!notRequired && values[name].length === 0) || name in errors)
          }
          isValid={!(name in errors) && values[name].length > 0}
          disabled={isSubmitting || disableInputs}
          autoComplete="off"
        />
        <Form.Control.Feedback type="invalid">
          {errors[name]}
        </Form.Control.Feedback>
      </Form.Group>

      {!noLabels && (
        <p className="muted text-center">
          You can also paste the whole map share URL
        </p>
      )}
    </>
  );
}
