describe("Best of the Best", () => {
  before(() => {
    cy.resetApi();
  });

  beforeEach(() => {
    cy.visit(`/best-of-the-best`);
  });

  it("should display the correct maps for every difficulty", () => {
    const expected = [0, 2, 4, 6 + 8 + 1];
    cy.get("[data-cy=difficulty-selector]").each(($difficultySelector, i) => {
      cy.wrap($difficultySelector).click();
      cy.get("[data-cy=custom-map]").should("have.length", expected[i]);
    });
  });
});
