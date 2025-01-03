describe("Home Page", () => {
  before(() => {
    cy.request(`${Cypress.env("maplist_api_url")}/reset-test`);
  });

  beforeEach(() => {
    cy.visit("/");
  });

  it("renders the featured users", () => {
    // cy.get("[data-cy=project-description]")
    //   .find("[data-cy=user-entry]")
    //   .should("have.length", 3);

    cy.get('[data-cy="project-credits"]')
      .find('[data-cy="user-entry"]')
      .should("have.length", 2);
  });

  it("renders recent completions correctly", async () => {
    cy.get('[data-cy="completion"]')
      .as("recent-completions")
      .should("have.length", 5);

    cy.request(`${Cypress.env("maplist_api_url")}/completions/recent`).then(
      ({ body }) => {
        cy.get("@recent-completions").each(($completion, i) => {
          const compData = body[i];
          cy.wrap($completion)
            .as("current-comp")
            .should("have.attr", "data-completion-id", compData.id.toString());
          cy.get("@current-comp")
            .find("[data-cy=user-entry]")
            .should("have.length", compData.users.length);
        });
      }
    );
  });
});
