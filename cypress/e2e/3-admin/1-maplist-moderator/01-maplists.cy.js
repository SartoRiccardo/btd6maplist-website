describe("Maplist Moderator - Maplists", () => {
  const uid = 30;

  before(() => {
    cy.resetApi();
  });

  beforeEach(() => {
    cy.login(uid, 16);
  });

  it("shows the insert map button correctly", () => {
    cy.visit("/maplist");
    cy.get("[data-cy=btn-custom-map]").should("have.length", 2);

    cy.visit("/expert-list");
    cy.get("[data-cy=btn-custom-map]").should("have.length", 1);
  });
});
