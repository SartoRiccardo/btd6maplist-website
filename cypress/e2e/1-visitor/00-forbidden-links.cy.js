it("can't see admin-only pages", () => {
  const adminOnly = [
    "/completions/1",
    "/completions/pending",
    "/map-submissions",
    "/config",
    "/map/MLXXXAA/edit",
    "/map/add",
    "/map/MLXXXAA/completios/new",
    "/roles",
  ];

  for (const url of adminOnly) {
    cy.visit(url, { failOnStatusCode: false });
    cy.request({ url, failOnStatusCode: false })
      .its("status")
      .should("equal", 404);
  }
});
