describe("Leaderboard", () => {
  beforeEach(() => {
    cy.visit(`${Cypress.env("base_url")}/list/leaderboard`);
  });

  it("should show how points are calculated", () => {
    cy.get('[data-cy="points-explanation"]').should("not.exist");

    cy.get('[data-cy="btn-points-explanation"]').click();
    cy.get('[data-cy="points-explanation"]');

    cy.get('[data-cy="btn-points-explanation"]').click();
    cy.get('[data-cy="points-explanation"]').should("not.exist");
  });

  it("should display the Maplist points leaderboard", () => {
    cy.request(`${Cypress.env("maplist_api_url")}/maps/leaderboard`).then(
      ({ body }) => {
        cy.get('[data-cy="leaderboard-entry"]').should("have.length.lte", 50);
        cy.get('[data-cy="leaderboard-entry"]')
          .first()
          .contains(`${body.entries[0].score}pt`);
      }
    );
  });

  it("can display the LCC leaderboard", () => {
    cy.get("button").contains("LCCs").click();

    cy.request(
      `${Cypress.env("maplist_api_url")}/maps/leaderboard?value=lccs`
    ).then(({ body }) => {
      cy.get('[data-cy="leaderboard-entry"]').should("have.length.lte", 51);
      cy.get('[data-cy="leaderboard-entry"]')
        .first()
        .contains(`${body.entries[0].score}`);
    });
  });

  //   it("can display the Expert List points leaderboard", () => {});

  //   it("should keep the same leaderboard type between navigations", () => {});
});
