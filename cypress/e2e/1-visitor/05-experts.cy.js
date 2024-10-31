describe("Expert List", () => {
  before(() => {
    cy.request(`${Cypress.env("maplist_api_url")}/reset-test`);
  });

  beforeEach(() => {
    cy.visit(`/experts`);
  });

  it("should display the correct maps for every difficulty", () => {
    cy.request(`${Cypress.env("maplist_api_url")}/exmaps`).then(({ body }) => {
      cy.get("[data-cy=difficulty-selector]").each(($difficultySelector) => {
        cy.wrap($difficultySelector).as("current-difficulty").click();
        cy.get("@current-difficulty")
          .invoke("attr", "data-difficulty")
          .then((currentDiff) => {
            cy.get("[data-cy=custom-map]").should(
              "have.length",
              body.filter((map) => map.difficulty === parseInt(currentDiff))
                .length
            );
          });
      });
    });
  });

  it.skip("should redirect to Discord when submitting a map", () => {
    cy.get("[data-cy=btn-custom-map]")
      .as("btn-custom-map")
      .should("have.length", 1);
    cy.get("@btn-custom-map").click();

    cy.origin("https://discord.com", () => {
      cy.window().its("location.hostname").should("include", "discord");
    });
  });
});
