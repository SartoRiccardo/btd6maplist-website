import cssRoleForm from "./RoleForm.module.css";
import Input from "../bootstrap/Input";
import Select from "../bootstrap/Select";
import { deepChange } from "@/utils/functions";
import { useState } from "react";

const AddRoleButton = ({ onChange, value, guilds, count, setCount }) => {
  return (
    <div>
      <button
        type="button"
        className="btn btn-success float-end"
        onClick={() => {
          const newVal = {
            ...value,
            linked_roles: [
              ...value.linked_roles,
              { guild_id: guilds[0].id, role_id: guilds[0].roles[0].id, count },
            ],
          };
          setCount(count + 1);
          onChange(newVal);
        }}
      >
        <i className="bi bi-plus-lg" />
      </button>
    </div>
  );
};

export default function RoleForm({
  name,
  value,
  onChange,
  onDelete,
  threshold,
  errors,
  touched,
  guilds,
}) {
  const [count, setCount] = useState(0);

  const handleChange = (evt, effects = null) => {
    let newVal = deepChange(
      JSON.parse(JSON.stringify(value)),
      evt.target.name.substring(name.length + 1),
      evt.target.value
    );
    if (effects) {
      for (const { field, value } of effects) {
        newVal = deepChange(newVal, field, value);
      }
    }
    onChange(newVal);
  };

  return (
    <div className={`row gy-1 gx-2 ${cssRoleForm.role_form}`}>
      <div className="col-12 d-flex align-items-top flex-col-space">
        <div className="w-100">
          <Input
            name={`${name}.name`}
            className={`font-border ${cssRoleForm.name}`}
            value={value.name}
            onChange={handleChange}
            style={{
              backgroundColor: value.clr_inner,
              border: `3px solid ${value.clr_border}`,
            }}
            placeholder="New Role"
            isInvalid={touched?.name && errors?.[`${name}.name`]}
          />
          <div className="invalid-feedback">{errors?.[`${name}.name`]}</div>
        </div>
        <Input
          name={`${name}.clr_inner`}
          type="color"
          value={value.clr_inner}
          onChange={handleChange}
        />
        <Input
          name={`${name}.clr_border`}
          type="color"
          value={value.clr_border}
          onChange={handleChange}
        />
        <div>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onDelete()}
          >
            <i className="bi bi-dash" />
          </button>
        </div>
      </div>

      {threshold && (
        <div className="col-12 col-lg-4">
          <label className="form-label">Point Threshold</label>
          <Input
            name={`${name}.threshold`}
            type="number"
            value={value.threshold}
            onChange={handleChange}
            placeholder="1000"
            isInvalid={touched?.threshold && errors?.[`${name}.threshold`]}
          />
          <div className="invalid-feedback">
            {errors?.[`${name}.threshold`]}
          </div>
        </div>
      )}

      <div className={`col-12 ${threshold ? "col-lg-8" : ""}`}>
        <label className="form-label">Tooltip description (optional)</label>
        <Input
          name={`${name}.tooltip_description`}
          type="text"
          value={value.tooltip_description}
          onChange={handleChange}
          placeholder="1000+ points on the Expert List"
          isInvalid={
            touched?.tooltip_description &&
            errors?.[`${name}.tooltip_description`]
          }
        />
        <div className="invalid-feedback">
          {errors?.[`${name}.tooltip_description`]}
        </div>
      </div>

      <div>
        <label className="form-label">Linked Discord Roles</label>
        {guilds && guilds.length ? (
          value.linked_roles.length ? (
            <>
              {value.linked_roles.map(({ guild_id, role_id, count }, i) => (
                <div className="d-flex w-100 flex-col-space mb-2" key={count}>
                  <div className="d-flex flex-1 flex-col-space">
                    <Select
                      name={`${name}.linked_roles[${i}].guild_id`}
                      value={guild_id}
                      onChange={(evt) => {
                        handleChange(evt, [
                          {
                            field: `linked_roles[${i}].role_id`,
                            value: guilds.find(
                              ({ id }) => id === evt.target.value
                            ).roles[0].id,
                          },
                        ]);
                      }}
                    >
                      {guilds.map(({ id, name }) => (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      ))}
                    </Select>

                    <Select
                      name={`${name}.linked_roles[${i}].role_id`}
                      value={role_id}
                      onChange={handleChange}
                    >
                      {guilds
                        .find(({ id }) => id === guild_id)
                        .roles.map(({ id, name }) => (
                          <option key={id} value={id}>
                            {name}
                          </option>
                        ))}
                    </Select>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => {
                        const newVal = {
                          ...value,
                          linked_roles: value.linked_roles.filter(
                            (rl) => count !== rl.count
                          ),
                        };
                        onChange(newVal);
                      }}
                    >
                      <i className="bi bi-dash" />
                    </button>
                  </div>
                </div>
              ))}
              <div className="float-right">
                <AddRoleButton
                  onChange={onChange}
                  value={value}
                  guilds={guilds}
                  count={count}
                  setCount={setCount}
                />
              </div>
            </>
          ) : (
            <div className="d-flex w-100 align-items-center">
              <p className="flex-1 muted mb-0">No linked roles yet!</p>
              <AddRoleButton
                onChange={onChange}
                value={value}
                guilds={guilds}
                count={count}
                setCount={setCount}
              />
            </div>
          )
        ) : (
          <p className="muted mb-0 mt-1">Loading...</p>
        )}
      </div>
    </div>
  );
}
