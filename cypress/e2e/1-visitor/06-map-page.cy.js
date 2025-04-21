describe("Map page", () => {
  before(() => {
    cy.request(`${Cypress.env("maplist_api_url")}/reset-test`);
  });

  it("shows a not found when a map doesn't exist", () => {
    cy.visit("/map/DOESNOTEXIST", { failOnStatusCode: false });
    // cy.request({ url: "/map/DOESNOTEXIST", failOnStatusCode: false })
    //   .its("status")
    //   .should("equal", 404);
  });

  it("displays the map's information", () => {
    const mapCode = "MLXXXCC";
    cy.visit(`/map/${mapCode}`);
    cy.contains("Optimal Hero");
    cy.get("[data-cy=creators]")
      .find("[data-cy=user-entry]")
      .should("have.length", 2);
    cy.get("[data-cy=verifiers]")
      .find("[data-cy=user-entry]")
      .should("have.length", 2);
    cy.get("h1").contains("Maplist Map 23");
    cy.get("[data-cy=aliases]");
    cy.get("[data-cy=code]").as("code").contains(mapCode);
    cy.get("@code").find("[data-cy=btn-copy]").realClick();
    cy.clipboard().should("equal", mapCode);
    cy.get("[data-cy=btn-custom-map-play]");

    cy.visit("/map/MLXXXEE");
    cy.get("[data-cy=btn-custom-map-play]").should("have.length", 3);
  });

  it.skip("redirects to Discord when submitting a run", () => {
    cy.visit("/map/MLXXXAB");
    cy.get("[data-cy=btn-submit-run]").click();
    cy.origin("https://discord.com", () => {
      cy.window().its("location.hostname").should("include", "discord");
    });
  });

  it("displays the current LCCs", () => {
    cy.visit("/map/MLXXXAB");
    cy.get("[data-cy=lcc]").as("lccs").should("have.length", 1);
    cy.get("@lccs").find("[data-cy=btn-completion-proof]").should("not.exist");

    cy.visit("/map/MLXXXCB");
    cy.get("[data-cy=lcc]").as("lccs").should("have.length", 1);
    cy.get("@lccs").find("[data-cy=btn-completion-proof]").click();
  });

  it("displays the map's completions", () => {
    cy.visit("/map/MLXXXAB");
    cy.get("[data-cy=btn-paginate-next]").first().click({ timeout: 10_000 });
    cy.get("[data-cy=single-completion]").should("have.length.lte", 50);

    cy.get("[data-cy=btn-paginate-back]").first().click({ timeout: 10_000 });
    cy.get("[data-cy=single-completion]").should("have.length", 50);

    cy.get("[data-cy=completion]")
      .as("completions")
      .eq(1)
      .find("[data-cy=user-entry]")
      .should("have.length", 1); // usr2

    cy.get("@completions")
      .eq(0)
      .find("[data-cy=user-entry]")
      .should("have.length", 3); // usr30, usr15, usr1
    cy.get("@completions").first().find("[data-cy=btn-completion-proof]");

    cy.visit("/map/MLXXXAA");
    cy.get("[data-cy^=btn-paginate-]").should("not.exist");
  });

  it("shows Round 6 starts correctly", () => {
    cy.visit("/map/MLXXXCE");
    cy.get("[data-cy=btn-r6-start-dropdown]").click();
    cy.get("[data-cy=r6-start-dropdown] iframe");

    cy.visit("/map/MLXXXCJ");
    cy.get("[data-cy=btn-r6-start-dropdown]").click();
    cy.get("[data-cy=r6-start-dropdown] img");

    cy.visit("/map/MLXXXEJ");
    cy.get("a").contains("Round 6 Start");
  });
});
