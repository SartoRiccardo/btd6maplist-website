describe("Maplist Moderator - Map Edit page", () => {
  const uid = 30;

  before(() => {
    cy.resetApi();
  });

  beforeEach(() => {
    cy.login(uid, 16);
  });

  it("hides fields they cannot edit", () => {
    cy.visit("/map/MLXXXAA/edit");
    cy.get("[name=placement_curver]");
    cy.get("[name=placement_allver]");
    cy.get("[name=difficulty]").should("not.exist");
  });
});
