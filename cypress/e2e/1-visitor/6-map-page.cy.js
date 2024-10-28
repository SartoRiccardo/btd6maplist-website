describe.skip("Map page", () => {
  before(() => {
    cy.request(`${Cypress.env("maplist_api_url")}/reset-test`);
  });

  it("should return 404 when a map doesn't exist", () => {});

  it("should display the map's information", () => {});

  it("should redirect to Discord when submitting a run", () => {});

  it("should display the current LCC", () => {});

  it("should display map completions", () => {});

  it("should show completion images", () => {});
});
