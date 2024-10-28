describe("Maplist", () => {
  before(() => {
    cy.request(`${Cypress.env("maplist_api_url")}/reset-test`);
  });

  beforeEach(() => {
    cy.visit(`/list`);
  });

  it("should display 50 maps", () => {
    cy.get("[data-cy=custom-map]").should("have.length", 50);
  });

  it("should redirect to Discord when submitting a map", () => {
    cy.get("[data-cy=btn-custom-map]")
      .as("btn-custom-map")
      .should("have.length", 1);
    cy.get("@btn-custom-map").click();

    cy.origin("https://discord.com", () => {
      cy.window().its("location.hostname").should("include", "discord");
    });
  });
});