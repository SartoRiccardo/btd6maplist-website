describe("Navbar for visitors", () => {
  before(() => {
    cy.request(`${Cypress.env("maplist_api_url")}/reset-test`);
  });

  beforeEach(() => {
    cy.visit("/");
  });

  describe("Desktop navbar", () => {
    it("should show and navigate on desktop", () => {
      cy.get("[data-cy=navbar-mobile]").should("not.be.visible");
      cy.get("[data-cy=navbar-desktop]")
        .as("nav")
        .contains("Leaderboard")
        .click();
      cy.location("pathname").should("equal", "/leaderboard");

      cy.get("@nav").contains("Maps").click();
      cy.get("[data-cy=nav-dropdown]").as("dropdown").should("be.visible");

      cy.get("@dropdown").contains("Expert").click();
      cy.location("pathname").should("equal", "/expert-list");

      cy.get("@nav").contains("Login").should("be.visible");
    });

    it("can search on desktop", () => {
      cy.get("[data-cy=navbar-desktop]")
        .as("nav")
        .find("[data-cy=btn-search]")
        .as("btn-search")
        .click();
      cy.get("[data-cy=form-search]:visible")
        .as("form-search")
        .should("have.length", 1);
      cy.get("@btn-search").click();
      cy.get("[data-cy=form-search]").should("not.be.visible");

      cy.get("@btn-search").click();
      cy.get("@form-search").find("[name=q]").as("in-query").type("usr");
      cy.get("@in-query")
        .parents("[data-cy=autocomplete]")
        .as("in-query-ac")
        .find("[data-cy=autocomplete-item]")
        .should("have.length", 5);
      cy.get("@in-query").type("{selectAll}{del}Maplist");

      cy.wait(2_000);
      cy.get("@in-query-ac")
        .find("[data-cy=autocomplete-item]")
        .first()
        .click();
      cy.location("pathname").should("match", /\/map\/[A-Z]{7}/);
    });
  });

  describe("Mobile navbar", () => {
    beforeEach(() => {
      cy.viewport("iphone-se2");
    });

    it("should show and navigate on mobile", () => {
      cy.get("[data-cy=navbar-desktop]").should("not.be.visible");
      cy.get("[data-cy=navbar-mobile-open]").as("btn-nav").click();

      cy.get("[data-cy=navbar-mobile-content]")
        .as("nav")
        .contains("Login")
        .should("be.visible");
      cy.get("@nav").contains("Leaderboard").as("leaderboard-link").click();
      cy.get("@leaderboard-link").should("not.be.visible");
      cy.location("pathname").should("equal", "/leaderboard");

      cy.get("@btn-nav").click();
      cy.get("@nav").contains("Maps").click();
      cy.get("@nav")
        .find("[data-cy=nav-dropdown]")
        .as("dropdown")
        .should("be.visible");
      cy.get("@dropdown").contains("Expert").click();
      cy.get("@nav").should("not.be.visible");
      cy.location("pathname").should("equal", "/expert-list");
    });

    it("should search on mobile", () => {
      cy.get("[data-cy=navbar-mobile-open]").as("btn-nav").click();

      cy.get("[data-cy=form-search]:visible")
        .find("[name=q]")
        .as("in-query")
        .type("usr");
      cy.get("@in-query")
        .parents("[data-cy=autocomplete]")
        .as("in-query-ac")
        .find("[data-cy=autocomplete-item]")
        .should("have.length", 5);
      cy.get("@in-query").type("{selectAll}{del}Maplist");

      cy.wait(2_000);
      cy.get("@in-query-ac")
        .find("[data-cy=autocomplete-item]")
        .first()
        .click();
      cy.location("pathname").should("match", /\/map\/[A-Z]{7}/);
    });
  });
});
