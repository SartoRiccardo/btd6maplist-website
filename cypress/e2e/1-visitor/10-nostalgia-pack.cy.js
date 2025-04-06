describe("Best of the Best", () => {
  before(() => {
    cy.resetApi();
  });

  beforeEach(() => {
    cy.visit(`/best-of-the-best`);
  });

  it("should display the correct maps for every game", () => {
    cy.get("[data-cy=difficulty-selector]").each(($difficultySelector) => {
      cy.wrap($difficultySelector).click();
      cy.get("[data-cy=btn-category]").each(($btn) => cy.wrap($btn).click());
    });
  });
});
