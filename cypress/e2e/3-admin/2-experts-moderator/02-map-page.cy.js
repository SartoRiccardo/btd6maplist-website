describe("Experts Moderator - Map Edit page", () => {
  const uid = 30;

  before(() => {
    cy.resetApi();
  });

  beforeEach(() => {
    cy.login(uid, 32);
  });

  it("hides fields they cannot edit", () => {
    cy.visit("/map/MLXXXAA/edit");
    cy.get("[name=placement_curver]").should("not.exist");
    cy.get("[name=placement_allver]").should("not.exist");
    cy.get("[name=difficulty]");
  });
});
