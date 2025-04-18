describe("Best of the Best", () => {
  before(() => {
    cy.resetApi();
  });

  beforeEach(() => {
    cy.visit(`/nostalgia-pack`);
  });

  it("should display the correct maps for every game", () => {
    cy.get("[data-cy=difficulty-selector]").eq(3).click();
    cy.get("[data-cy=btn-category]").each(($btn) => cy.wrap($btn).click());
  });
});
