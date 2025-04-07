describe("User page", () => {
  const uid = 30;

  Cypress.Commands.add("testAddRemoveRoles", (expectedRoleNum) => {
    cy.intercept("PATCH", /\/users\/\d+\/roles/).as("req-roles");
    cy.get("[data-cy=btn-role-remove]").should("not.exist");

    cy.get("[data-cy=btn-role-grant]").as("btn-role-grant");
    for (let count = expectedRoleNum; count > 0; count--) {
      cy.get("@btn-role-grant").click();
      cy.get("[data-cy=role-grant]").should("have.length", count);
      cy.get("[data-cy=role-grant]").first().click();
      cy.wait("@req-roles").its("response.statusCode").should("equal", 204);
    }

    cy.get("@btn-role-grant").should("not.exist");
    cy.get("[data-cy=btn-role-remove]").should("have.length", expectedRoleNum);

    for (let count = expectedRoleNum; count > 0; count--) {
      cy.get("[data-cy=btn-role-remove]").should("have.length", count);
      cy.get("[data-cy=btn-role-remove]").first().click();
      cy.get("@btn-role-grant");
      cy.wait("@req-roles").its("response.statusCode").should("equal", 204);
    }
  });

  beforeEach(() => {
    cy.resetApi();
    cy.login(uid, { roles: [5] });
  });

  it("cannot edit one's own roles", () => {
    cy.visit(`/user/${uid}`);
    cy.testAddRemoveRoles(2);

    cy.visit("/user/40");
    cy.testAddRemoveRoles(2);
  });
});
