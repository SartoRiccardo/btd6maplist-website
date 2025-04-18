const { veryLongString } = require("../../support/helpers");

describe("Edit Achievement Roles", () => {
  const uid = 30;

  beforeEach(() => {
    cy.resetApi();
    cy.login(uid, { permissions: { "!mod": null } });
    cy.visit("/roles");
  });

  it("should submit correctly", () => {
    cy.intercept("PUT", "/roles/achievement").as("req-edit-roles");

    // Switch all LB options
    cy.get("[name=lb_format] option").each((_, idx) => {
      cy.get("[name=lb_format]")
        .select(idx)
        .then(() => {
          cy.get("[name=lb_type] option").each((_, idx) => {
            cy.get("[name=lb_type]").select(idx);
          });
        });
    });
    cy.get("[name=lb_format]").select(0);
    cy.get("[name=lb_type]").select(0);

    // Remove a role
    cy.get("[data-cy=threshold-roles] [data-cy=fgroup-role]")
      .first()
      .find("[data-cy=btn-role-delete]")
      .click();

    // Remove all DS roles
    cy.get("[data-cy=threshold-roles] [data-cy=fgroup-role]")
      .last()
      .as("last-role")
      .find("[data-cy=btn-linked-role-delete]")
      .each(($btn) => cy.wrap($btn).click());

    // Add DS roles
    cy.get("@last-role").find("[data-cy=btn-linked-role-add]").click();
    cy.get("@last-role").find('[name$=".guild_id"]').first().select(1);
    cy.get("@last-role").find('[name$=".role_id"]').first().select(3);

    // Add a role
    cy.get(
      "[data-cy=addable-field][data-cy-name=roles] [data-cy=btn-addable-field]"
    ).click();
    cy.get("@last-role").find('[name$=".name"]').type("Test role name");
    cy.get("@last-role")
      .find('[name$=".clr_border"]')
      .invoke("val", "#ff0000")
      .trigger("change");
    cy.get("@last-role")
      .find('[name$=".clr_inner"]')
      .invoke("val", "#0000ff")
      .trigger("change");
    cy.get("@last-role").find('[name$=".threshold"]').type("1000");
    cy.get("@last-role")
      .find('[name$=".tooltip_description"]')
      .type("More than 1k points! Congrats!");

    cy.get("[data-cy=form-edit-roles]").as("form").submit();
    cy.get("[data-cy=toast-success]");
    cy.get("[data-cy=toast-success]", { timeout: 10_000 }).should("not.exist");
    cy.wait("@req-edit-roles").its("response.statusCode").should("equal", 204);

    // Remove FP role
    cy.get("[data-cy=first-place-role]")
      .as("first-place")
      .find("[data-cy=btn-role-delete]")
      .click();
    cy.get("@form").submit();
    cy.wait("@req-edit-roles").its("response.statusCode").should("equal", 204);

    // Remove all
    cy.get("[data-cy=btn-role-delete]").each(($btn) => cy.wrap($btn).click());
    cy.get("@form").submit();
    cy.wait("@req-edit-roles").its("response.statusCode").should("equal", 204);

    // Add FP role
    cy.get("[data-cy=btn-add-first-place-role]").click();
    cy.get("[data-cy=btn-add-first-place-role]").should("not.exist");
    cy.get("@first-place").find('[name$=".name"]').type("Test role name");
    cy.get("@first-place").find('[name$=".threshold"]').should("not.exist");
    cy.get("@form").submit();
    cy.wait("@req-edit-roles").its("response.statusCode").should("equal", 204);
  });

  it("should validate the submission", () => {
    cy.intercept("PUT", "/roles/achievement").as("req-edit-roles");

    cy.get(
      "[data-cy=addable-field][data-cy-name=roles] [data-cy=btn-addable-field]"
    ).click();
    cy.get("[data-cy=threshold-roles] [data-cy=fgroup-role]")
      .last()
      .as("last-role");
    cy.get("@last-role").find(`[name$='.threshold']`).type("1000");
    cy.get("[data-cy=form-edit-roles]").as("form");

    for (const field of ["name", "tooltip_description"]) {
      cy.get("@last-role")
        .find(`[name$='.${field}']`)
        .as("cur-field")
        .type(veryLongString(200), { delay: 1 });
      cy.get("@form").submit();
      cy.get("@cur-field")
        .parents("[data-cy=fgroup]")
        .find(".invalid-feedback")
        .as("error");
      cy.get("@cur-field").type("{selectAll}{del}");
      cy.get("@error");
      cy.get("@cur-field").type("something");
      cy.get("@error").should("not.be.visible");
    }

    cy.get("@last-role")
      .find(`[name$='.threshold']`)
      .as("cur-field")
      .type("{selectAll}{del}");
    cy.get("@error");
    cy.get("@cur-field").type("-10");
    cy.get("@error");
    cy.get("@cur-field").type("{selectAll}{del}10");
    cy.get("@error").should("not.be.visible");

    cy.get("@last-role").find("[data-cy=btn-linked-role-add]").click();
    cy.get("@last-role").find(`[name$='.role_id']`).as("cur-field").select(8);
    cy.get("@error");
    cy.get("@cur-field").select(0);
    cy.get("@error").should("not.exist");
  });
});
