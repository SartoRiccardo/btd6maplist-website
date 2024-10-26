describe.skip("Expert List", () => {
  beforeEach(() => {
    cy.visit(`${Cypress.env("base_url")}/experts`);
  });

  it("should display the correct maps for every difficulty", () => {});

  it('should display the "Submit Map" button', () => {});

  it("should redirect to Discord when submitting a map", () => {});
});
