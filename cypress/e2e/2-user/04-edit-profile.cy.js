describe("Edit Profile", () => {
  const uid = 30;

  Cypress.Commands.add("shouldFailSubmit", () => {
    cy.get("[data-cy=form-edit-user]").submit();
    cy.get("[data-cy=toast-success]").should("not.exist");
  });

  beforeEach(() => {
    cy.request(`${Cypress.env("maplist_api_url")}/reset-test`);
    cy.login(uid);
    cy.visit("/user/edit");
  });

  it("can edit one's own profile", () => {
    cy.intercept("PUT", "/users/@me").as("req-edit-self");

    cy.get("input[name=name]").type("{selectAll}{del}Untaken Name");
    cy.get("input[name=oak]").as("in-oak").type("{selectAll}{del}");
    cy.get("[data-cy=form-edit-user]").as("form").submit();
    cy.get("[data-cy=toast-success]");
    cy.get("[data-cy=toast-success]", { timeout: 10_000 }).should("not.exist");
    cy.wait("@req-edit-self").its("response.statusCode").should("equal", 200);

    cy.get("@in-oak").type("oak_correct");
    cy.get("@form").submit();
    cy.get("[data-cy=toast-success]");
  });

  it("doesn't let you submit when fields are invalid", () => {
    let veryLongName = "";
    for (let i = 0; i < 200; i++) veryLongName += "x";

    cy.intercept("PUT", "/users/@me").as("req-edit-self");

    cy.get("input[name=name]")
      .as("in-name")
      .type(`{selectAll}{del}${veryLongName}`);
    cy.shouldFailSubmit();
    cy.get("[data-cy=fgroup-name]")
      .find(".invalid-feedback")
      .as("err-name")
      .should("not.be.empty");

    cy.get("@in-name").type(`{selectAll}{del}invalid character &`);
    cy.shouldFailSubmit();
    cy.get("@err-name").should("not.be.empty");

    cy.get("@in-name").type(`{selectAll}{del}`);
    cy.get("@err-name").should("not.be.empty");
    cy.shouldFailSubmit();

    cy.get("@in-name").type(`{selectAll}{del}usr${uid}`);
    cy.get("input[name=oak]").as("in-oak").type("{selectAll}{del}verywrong");
    cy.get("[data-cy=fgroup-oak]")
      .find(".invalid-feedback")
      .as("err-oak")
      .should("not.be.empty");

    cy.shouldFailSubmit();
    cy.get("@in-oak").type("{selectAll}{del}oak_verywrong");
    cy.shouldFailSubmit();
    cy.get("@err-oak").should("not.be.empty");
    cy.wait("@req-edit-self").its("response.statusCode").should("equal", 400);
  });
});
