describe.skip("Leaderboard", () => {
  beforeEach(() => {
    cy.visit(`${Cypress.env("base_url")}/leaderboard`);
  });

  it("should display the Maplist points leaderboard", () => {});

  it("can display the LCC leaderboard", () => {});

  //   it("can display the Expert List points leaderboard", () => {});

  //   it("should keep the same leaderboard type between navigations", () => {});
});
