describe("User page", () => {
  before(() => {
    cy.request(`${Cypress.env("maplist_api_url")}/reset-test`);
  });

  it("should return a not found page when a user doesn't exist", () => {
    cy.visit("/user/317369619631", { failOnStatusCode: false });
    cy.request({ url: "/user/317369619631", failOnStatusCode: false })
      .its("status")
      .should("equal", 404);
  });

  it("should display the correct roles", () => {
    cy.visit(`/user/42`);
    cy.get("[data-cy=user-roles]").as("u42-roles").contains("List Map Creator");
    cy.get("@u42-roles").contains("Expert Map Creator");
    cy.get("@u42-roles").contains("The GOAT");

    cy.visit("/list/leaderboard");
    cy.get("[data-cy=leaderboard-entry]")
      .eq(2)
      .find("[data-cy=user-entry]")
      .click();
    cy.get("[data-cy=user-roles]").contains("Expert");

    cy.visit("/list/leaderboard");
    cy.get("[data-cy=leaderboard-entry]")
      .last()
      .find("[data-cy=user-entry]")
      .click();
    cy.get("[data-cy=user-roles]").contains("Beginner");
  });

  it("should display the user's completions", () => {
    cy.visit(`/user/42`);

    cy.get("[data-cy=single-completion]").should("have.length.lte", 50);

    cy.get("[data-cy=btn-paginate-next]").first().click();
    cy.get("[data-cy=single-completion]").should("have.length.lte", 50);

    cy.get("[data-cy=btn-paginate-back]").first().click();
    cy.get("[data-cy=single-completion]")
      .as("completions")
      .should("have.length.lte", 50);

    cy.get("@completions")
      .eq(3)
      .find("[data-cy=btn-completion-proof]")
      .should("not.exist");

    cy.get("@completions")
      .first()
      .find("[data-cy=btn-completion-proof]")
      .click();
    cy.get("[data-cy=zoomed-image]").as("zoomed-image").should("be.visible");
    cy.get("@zoomed-image").find("[data-cy^=image-]").should("have.length", 2);
    cy.get("@zoomed-image").find("[data-cy=image-next").click();
    cy.get("@zoomed-image").find("[data-cy=image-back").click();
    cy.get("@zoomed-image").clickOutside();
    cy.get("@zoomed-image").should("not.exist");

    cy.get("@completions").eq(1).find("[data-cy=btn-completion-proof]").click();
    cy.get("[data-cy=zoomed-image]").as("zoomed-image").should("be.visible");
    cy.get("[data-cy^=image-]").should("not.exist");
  });

  it("should display the user's created maps", () => {
    cy.visit(`/user/42`);
    cy.get("[data-cy=created-maps]").find("[data-cy=custom-map]");
  });

  it("cannot access the edit page", () => {
    cy.visit("/user/edit");
  });
});
