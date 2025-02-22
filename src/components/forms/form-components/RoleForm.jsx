import cssRoleForm from "./RoleForm.module.css";
import Input from "../bootstrap/Input";
import Select from "../bootstrap/Select";
import { deepChange } from "@/utils/functions";

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
    <div className={cssRoleForm.role_form}>
      <div className="d-flex align-items-top flex-col-space">
        <div>
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
        <div>
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

      <div>
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
        {guilds && guilds.length
          ? value.linked_roles.map(({ guild_id, role_id }, i) => (
              <div className="row gx-1" key={`${guild_id}-${role_id}`}>
                <div className="col-6">
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
                </div>
                <div className="col-6">
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
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
