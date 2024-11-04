describe("Navbar for visitors", () => {
  before(() => {
    cy.request(`${Cypress.env("maplist_api_url")}/reset-test`);
  });

  beforeEach(() => {
    cy.visit("/");
  });

  it("should show and navigate on desktop", () => {
    cy.get("[data-cy=navbar-mobile]").should("not.be.visible");
    cy.get("[data-cy=navbar-desktop]")
      .as("nav")
      .contains("Leaderboard")
      .click();
    cy.url().should("equal", "/leaderboard");

    cy.get("@nav").contains("Maps").click();
    cy.get("[data-cy=nav-dropdown]").as("dropdown").should("be.visible");

    cy.get("@dropdown").contains("Expert").click();
    cy.url().should("equal", "/expert-list");

    cy.get("@nav").contains("Login").should("be.visible");
  });

  it("should show and navigate on mobile", () => {
    cy.viewport("iphone-se2");

    cy.get("[data-cy=navbar-desktop]").should("not.be.visible");
    cy.get("[data-cy=navbar-mobile-open]").as("btn-nav").click();

    cy.get("[data-cy=navbar-mobile-content]")
      .as("nav")
      .contains("Login")
      .should("be.visible");
    cy.get("@nav").contains("Leaderboard").as("leaderboard-link").click();
    cy.get("@leaderboard-link").should("not.be.visible");
    cy.url().should("equal", "/leaderboard");

    cy.get("@btn-nav").click();
    cy.get("@nav").contains("Maps").click();
    cy.get("@nav")
      .find("[data-cy=nav-dropdown]")
      .as("dropdown")
      .should("be.visible");
    cy.get("@dropdown").contains("Expert").click();
    cy.get("@nav").should("not.be.visible");
    cy.url().should("equal", "/expert-list");
  });
});
