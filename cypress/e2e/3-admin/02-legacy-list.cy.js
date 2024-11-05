describe("Legacy List", () => {
  const uid = 30;

  before(() => {
    cy.resetApi();
  });

  beforeEach(() => {
    cy.login(uid, 64);
    cy.visit("/hidden-maps");
  });

  it("shows the legacy list", () => {
    cy.request(`${Cypress.env("maplist_api_url")}/maps/legacy`).then(
      (response) => {
        cy.get("[data-cy=custom-map]").should(
          "have.length",
          response.body.length
        );
      }
    );
  });
});
