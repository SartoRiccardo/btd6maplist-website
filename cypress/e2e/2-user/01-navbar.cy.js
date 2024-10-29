describe("Logged in user navbar", () => {
  const uid = 30;

  beforeEach(() => {
    cy.visit(`/api/auth?code=mock_discord_code_${uid}_0`);
  });

  it("has a section for one's profile on desktop", () => {
    cy.get("[data-cy=navbar-desktop]")
      .find("[data-cy=user-tab]:visible")
      .as("user-tab")
      .click();

    cy.get("[data-cy=nav-dropdown]").as("dropdown").should("be.visible");

    cy.get("@dropdown").contains("Profile").click();
    cy.url().should("include", `/user/${uid}`);
  });

  it("should show and navigate on mobile", () => {
    cy.viewport("iphone-se2");

    cy.get("[data-cy=navbar-mobile-open]").as("btn-nav").click();
    cy.get("[data-cy=navbar-mobile-content]")
      .as("nav")
      .find("[data-cy=user-tab]:visible")
      .click();
    cy.get("@nav")
      .find("[data-cy=nav-dropdown]:visible")
      .contains("Profile")
      .click();
    cy.get("@nav").should("not.be.visible");
    cy.url().should("include", `/user/${uid}`);
  });
});
