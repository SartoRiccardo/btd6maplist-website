describe.skip("Maplist", () => {
  beforeEach(() => {
    cy.visit(`${Cypress.env("base_url")}/list`);
  });

  it("should display 50 maps", () => {});

  it('should display the "Submit Map" button', () => {});

  it("should redirect to Discord when submitting a map", () => {});
});
