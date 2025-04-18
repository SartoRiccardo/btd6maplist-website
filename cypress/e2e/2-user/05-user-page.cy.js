describe("User page - Authenticated", () => {
  const uid = 30;

  beforeEach(() => {
    cy.request(`${Cypress.env("maplist_api_url")}/reset-test`);
    cy.login(uid);
  });

  it("cannot edit roles", () => {
    it("cannot edit a user's roles", () => {
      cy.visit(`/user/42`);
      cy.get("[data-cy=btn-role-grant]").should("not.exist");

      cy.visit(`/user/${uid}`);
      cy.get("[data-cy=btn-role-grant]").should("not.exist");
    });
  });
});
