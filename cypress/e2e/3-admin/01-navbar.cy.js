describe("Admin user navbar", () => {
  const uid = 30;
  const adminUrls = [
    { content: "Legacy", url: "/hidden-maps" },
    { content: "Config", url: "/config" },
    { content: "Pending", url: "/completions/pending" },
    { content: "Map", url: "/map-submissions" },
  ];

  before(() => {
    cy.resetApi();
  });

  beforeEach(() => {
    cy.login(uid, 64);
    cy.visit("/");
  });

  it("shows the admin panel on desktop", () => {
    cy.get("[data-cy=navbar-desktop]")
      .as("nav")
      .find("[data-cy=admin-tab]:visible")
      .as("admin-tab")
      .realHover();

    cy.get("@admin-tab")
      .find("[data-cy=nav-dropdown]")
      .as("dropdown")
      .should("be.visible");

    for (const { content, url } of adminUrls) {
      cy.get("@dropdown").contains(content).click();
      cy.location("pathname").should("equal", url);
    }
  });

  it("shows the admin panel on mobile", () => {
    cy.viewport("iphone-se2");

    cy.get("[data-cy=navbar-mobile-open]").as("btn-nav").click();
    cy.get("[data-cy=navbar-mobile-content]")
      .as("nav")
      .find("[data-cy=admin-tab]:visible")
      .as("admin-tab")
      .contains("Admin")
      .click();
    cy.get("[data-cy=navbar-mobile-close]").as("btn-close").click();

    for (const { content, url } of adminUrls) {
      cy.get("@btn-nav").click();
      cy.get("@admin-tab").contains(content).click();
      cy.location("pathname").should("equal", url);
      cy.get("@nav").should("not.be.visible");
    }
  });
});
