"use client";
import Select from "@/components/forms/bootstrap/Select";
import ConfigForm from "@/components/forms/form-components/ConfigForm";
import FormEditFormat from "@/components/forms/FormEditFormat";
import {
  useFormatsWhere,
  useMaplistFormats,
  useTypedMaplistConfig,
} from "@/utils/hooks";
import { useState } from "react";

export default function ConfigPageClient() {
  const formatsWithEditConfig = useFormatsWhere("edit:config");
  const maplistConfig = useTypedMaplistConfig();
  const permsInAll = formatsWithEditConfig.includes(null);
  const validFormatInfo = useMaplistFormats().filter(
    ({ id }) => permsInAll || formatsWithEditConfig.includes(id)
  );
  const [selectedFormat, setSelectedFormat] = useState(
    validFormatInfo?.[0]?.id || ""
  );

  const selectedVars = {};
  for (const vname of Object.keys(maplistConfig)) {
    if (maplistConfig[vname].formats.includes(selectedFormat))
      selectedVars[vname] = maplistConfig[vname];
  }

  return (
    <>
      <div className="row justify-content-center mb-3">
        <div className="col-12 col-md-6">
          <Select
            name="format"
            onChange={(evt) => setSelectedFormat(parseInt(evt.target.value))}
            value={selectedFormat}
          >
            {validFormatInfo.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-lg-6">
          <FormEditFormat formatId={selectedFormat} />
        </div>
        <div className="col-12 col-lg-6">
          <ConfigForm key={selectedFormat} fields={selectedVars} />
        </div>
      </div>
    </>
  );
}
