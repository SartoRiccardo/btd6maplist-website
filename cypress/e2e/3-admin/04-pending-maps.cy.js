describe("Pending Maps", () => {
  const uid = 30;

  before(() => {
    cy.resetApi();
  });

  beforeEach(() => {
    cy.login(uid, 64);
  });

  it("shows pending maps", () => {
    cy.visit("/map-submissions");
    cy.get("[data-cy^=map-submission]").should("have.length", 50);

    cy.get("[data-cy=btn-toggle-deleted]").click();
    cy.get("[data-cy^=map-submission]").should("have.length", 50);
    cy.get("[data-cy=map-submission-deleted]");
  });

  it("can delete pending maps", () => {
    cy.visit("/map-submissions?show=all");
    cy.intercept("DELETE", "/maps/submit/*").as("req-reject-subm");

    cy.get("[data-cy=map-submission-deleted]").then(($deletedSubmissions) => {
      const expectedDeletedSubms = $deletedSubmissions.length + 1;
      cy.log($deletedSubmissions);
      cy.get("[data-cy=map-submission]")
        .find("[data-cy=btn-delete-submission]")
        .first()
        .click();
      cy.get("[data-cy=btn-delete-submission-confirm]").click();
      cy.wait("@req-reject-subm")
        .its("response.statusCode")
        .should("equal", 204);
      cy.get("[data-cy=btn-delete-submission-confirm]").should("not.exist");
      cy.get("[data-cy=map-submission-deleted]").should(
        "have.length",
        expectedDeletedSubms
      );
    });
  });
});
