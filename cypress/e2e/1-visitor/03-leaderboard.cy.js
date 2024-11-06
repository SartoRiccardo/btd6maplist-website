describe("Leaderboard", () => {
  const assertFirstLbEntry = (lbQuery) => {
    cy.request(
      `${Cypress.env("maplist_api_url")}/maps/leaderboard?${lbQuery}`
    ).then(({ body }) => {
      cy.get('[data-cy="leaderboard-entry"]').should("have.length.lte", 50);
      cy.get('[data-cy="leaderboard-entry"]')
        .first()
        .contains(`${body.entries[0].score}`);
    });
  };

  before(() => {
    cy.request(`${Cypress.env("maplist_api_url")}/reset-test`);
  });

  beforeEach(() => {
    cy.visit(`/list/leaderboard`);
  });

  it("should show how points are calculated", () => {
    cy.get('[data-cy="points-explanation"]').should("not.exist");

    cy.get('[data-cy="btn-points-explanation"]').click();
    cy.get('[data-cy="points-explanation"]');

    cy.get('[data-cy="btn-points-explanation"]').click();
    cy.get('[data-cy="points-explanation"]').should("not.exist");
  });

  it("should display the Maplist points leaderboard", () => {
    assertFirstLbEntry("");
  });

  it("can display the LCC leaderboard", () => {
    cy.get("button").contains("LCCs").click();
    assertFirstLbEntry("value=lccs");
  });

  it("can display the Expert List points leaderboard", () => {
    cy.get("[data-cy=difficulty-selector][data-difficulty=51]").click();
    assertFirstLbEntry("format=51");
  });

  it("can display all leaderboards", () => {
    const values = [
      { name: "LCCs", value: "lccs" },
      { name: "Points", value: "points" },
      { name: "Optimal", value: "no_optimal_hero", valueApi: "no_geraldo" },
      { name: "Black", value: "black_border" },
    ];
    const formats = [
      { formatNum: "51", formatQuery: "experts" },
      { formatNum: "1", formatQuery: "current" },
    ];

    for (const { formatNum, formatQuery } of formats) {
      cy.get(
        `[data-cy=difficulty-selector][data-difficulty=${formatNum}]`
      ).click();
      cy.location("search").should("include", `format=${formatQuery}`);

      for (const valueInfo of values) {
        cy.get("button").contains(valueInfo.name).click();
        cy.location("search")
          .should("include", `format=${formatQuery}`)
          .and("include", `value=${valueInfo.value}`);

        assertFirstLbEntry(
          `format=${formatNum}&value=${valueInfo?.valueApi || valueInfo.value}`
        );
      }
    }
  });
});
