import { testAddRemoveRoles } from "../../../support/tests";

describe("Modify roles", () => {
  const uid = 30;

  beforeEach(() => {
    cy.resetApi();
    cy.login(uid, 32);
  });

  it("cannot edit one's own roles", () => {
    cy.visit(`/user/${uid}`);
    testAddRemoveRoles(2);

    cy.visit("/user/40");
    testAddRemoveRoles(2);
  });
});
