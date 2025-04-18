describe("Maplists Pages", () => {
  const uid = 30;

  before(() => {
    cy.resetApi();
  });

  it("shows the insert map button correctly", () => {
    const routes = [
      { route: "/maplist", formatId: 1, submOpen: true },
      { route: "/expert-list", formatId: 51, submOpen: true },
      { route: "/best-of-the-best", formatId: 52, submOpen: false },
    ];

    for (const { route, formatId } of routes) {
      cy.login(uid, {
        permissions: { "!curator": [formatId], "!basic": null },
      });
      cy.visit(route);
      for (const visit of routes) {
        cy.visit(visit.route);
        cy.get("[data-cy=btn-custom-map]").should(
          "have.length",
          (visit.route === route) + visit.submOpen
        );
      }
    }
  });
});
