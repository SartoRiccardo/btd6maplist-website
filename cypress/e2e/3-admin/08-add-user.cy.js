describe("Add User", () => {
  const uid = 30;
  let veryLongString = "";
  for (let i = 0; i < 500; i++) veryLongString += "x";

  Cypress.Commands.add("shouldFailSubmit", (form) => {
    cy.get(form).submit();
    cy.get("[data-cy=toast-success]").should("not.exist");
  });

  before(() => {
    cy.request(`${Cypress.env("maplist_api_url")}/reset-test`);
  });

  beforeEach(() => {
    cy.visit(`/api/auth?code=mock_discord_code_${uid}_64`);
    cy.visit("/config");
    cy.intercept("POST", "/users").as("req-add-user");
    cy.get("[data-cy=form-add-user]").as("form");
    cy.get("@form").find("[name=discord_id]").as("in-id");
    cy.get("@form").find("[name=name]").as("in-name");
  });

  it("can add a user", () => {
    cy.get("@in-id").type("999999");
    cy.get("@in-name").type("New User Just Added");
    cy.get("@form").submit();
    cy.get("[data-cy=toast-success]");
    cy.wait("@req-add-user").its("response.statusCode").should("equal", 201);
  });

  it("doesn't submit if some fields are invalid", () => {
    cy.wait(1000);
    cy.shouldFailSubmit("@form");

    cy.get("@in-id")
      .parents("[data-cy=form-group]")
      .find(".invalid-feedback")
      .as("err-id")
      .should("not.be.empty");
    cy.get("@in-name")
      .parents("[data-cy=form-group]")
      .find(".invalid-feedback")
      .as("err-name")
      .should("not.be.empty");

    cy.get("@in-id").type("a");
    cy.get("@in-name").type("username1234");
    cy.shouldFailSubmit("@form");
    cy.get("@err-id").should("not.be.empty");
    cy.get("@err-name").should("be.empty");

    cy.get("@in-id").type("{selectAll}{del}909090");
    cy.get("@in-name").type(`{selectAll}{del}${veryLongString}`, { delay: 1 });
    cy.shouldFailSubmit("@form");
    cy.get("@err-id").should("be.empty");
    cy.get("@err-name").should("not.be.empty");

    cy.get("@in-name").type(`{selectAll}{del}invalid characters&&&`);
    cy.shouldFailSubmit("@form");
    cy.get("@err-name").should("not.be.empty");
  });

  it("doesn't submit if the user exists", () => {
    cy.get("@in-id").type("20");
    cy.get("@in-name").type("Super mega user 20");
    cy.shouldFailSubmit("@form");
    cy.wait("@req-add-user").its("response.statusCode").should("equal", 400);
    cy.get("@in-id")
      .parents("[data-cy=form-group]")
      .find(".invalid-feedback")
      .should("not.be.empty");

    cy.get("@in-id").type("0000");
    cy.get("@in-name").type("{selectAll}{del}usr20");
    cy.shouldFailSubmit("@form");
    cy.wait("@req-add-user").its("response.statusCode").should("equal", 400);
    cy.get("@in-name")
      .parents("[data-cy=form-group]")
      .find(".invalid-feedback")
      .should("not.be.empty");
  });
});
