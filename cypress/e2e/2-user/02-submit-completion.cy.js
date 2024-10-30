describe("Submit Completion", () => {
  Cypress.Commands.add("shouldFailSubmit", () => {
    cy.get("[data-cy=form-submit-completion]").submit();
    cy.get("[data-cy=sidebar-success]").should("not.exist");
  });

  Cypress.Commands.add("fillCompletionImages", () => {
    cy.get("[name^=proof_completion]").each(($proof) =>
      cy
        .wrap($proof)
        .selectFile("public/heros/hero_ezili.webp", { action: "drag-drop" })
    );
  });

  const uid = 30;

  before(() => {
    cy.request(`${Cypress.env("maplist_api_url")}/reset-test`);
  });

  beforeEach(() => {
    cy.visit(`/api/auth?code=mock_discord_code_${uid}_0`);
  });

  it("can't submit on deleted map", () => {});

  it("doesn't let you submit if some fields are invalid", () => {});

  describe("Banned and restricted users", () => {
    it("forces requires recording users to submit video proof", () => {
      cy.visit(`/api/auth?code=mock_discord_code_${uid}_4`);
      cy.visit("/map/MLXXXAA/submit");
      cy.intercept("POST", "/maps/MLXXXAA/completions/submit").as(
        "req-comp-submission"
      );

      cy.fillCompletionImages();
      cy.shouldFailSubmit();

      cy.get("[name^=video_proof_url]")
        .first()
        .as("in-vproof")
        .parents("[data-cy=addable-field]")
        .find(".invalid-feedback")
        .should("not.be.empty");

      cy.get("@in-vproof").type("https://youtu.be/rickroll");
      cy.get("[data-cy=form-submit-completion]").submit();
      cy.wait("@req-comp-submission")
        .its("response.statusCode")
        .should("equal", 201);
    });

    it("prevents banned users from submitting", () => {
      cy.visit(`/api/auth?code=mock_discord_code_${uid}_8`);
      cy.visit("/map/MLXXXAA/submit");
      cy.intercept("POST", "/maps/MLXXXAA/completions/submit").as(
        "req-comp-submission"
      );

      cy.fillCompletionImages();
      cy.shouldFailSubmit();
      cy.get("[data-cy=toast-error]");
      cy.wait("@req-comp-submission")
        .its("response.statusCode")
        .should("equal", 403);
    });
  });

  describe("Submits succcessfully", () => {
    it("submits a basic completion", () => {
      cy.visit("/map/MLXXXAA");
      cy.intercept("POST", "/maps/MLXXXAA/completions/submit").as(
        "req-comp-submission"
      );

      cy.get("[data-cy=btn-submit-run]").click();
      cy.location("pathname").should("equal", "/map/MLXXXAA/submit");

      cy.fillCompletionImages();
      cy.get("[data-cy=form-submit-completion]").submit();
      cy.wait("@req-comp-submission")
        .its("response.statusCode")
        .should("equal", 201);
    });

    it("submits a completion with all fields", () => {
      cy.visit("/map/MLXXXAA/submit");
      cy.intercept("POST", "/maps/MLXXXAA/completions/submit").as(
        "req-comp-submission"
      );

      cy.get('[name="proof_completion[0].file"]')
        .parents("[data-cy=addable-field]")
        .as("fgroup-proof")
        .find("[data-cy=btn-remove-field]")
        .should("not.exist");
      for (let i = 0; i < 3; i++)
        cy.get("@fgroup-proof").find("[data-cy=btn-addable-field]").click();
      cy.get("@fgroup-proof")
        .find("[data-cy=btn-addable-field]")
        .should("not.exist");
      cy.get("@fgroup-proof")
        .find("[data-cy=btn-remove-field]")
        .should("have.length", 4);
      cy.get("@fgroup-proof").find("[data-cy=btn-remove-field]").eq(2).click();
      cy.fillCompletionImages();

      cy.get("[name=notes]").type("This completion was very hard!!!");

      const checkboxes = ["black_border", "no_geraldo", "current_lcc"];
      for (const input of checkboxes) {
        cy.get("[name^=video_proof_url]").should("not.exist");
        cy.get(`[name=${input}]`).check();
        cy.get("[name^=video_proof_url]");
        cy.get(`[name=${input}]`).uncheck();
      }

      cy.get("[name=leftover]").should("not.exist");
      cy.get("[name=current_lcc]").check();
      cy.get("[name=leftover]").type("999999");

      cy.get("[name=black_border]").check();
      cy.get("[name=no_geraldo]").check();

      cy.get("[name^=video_proof_url]")
        .parents("[data-cy=addable-field]")
        .as("fgroup-vproof");
      for (let i = 0; i < 4; i++)
        cy.get("@fgroup-vproof").find("[data-cy=btn-addable-field]").click();
      cy.get("@fgroup-vproof")
        .find("[data-cy=btn-addable-field]")
        .should("not.exist");
      cy.get("@fgroup-vproof")
        .find("[data-cy=btn-remove-field]")
        .should("have.length", 5);
      cy.get("[name^=video_proof_url]").each(($vproof, i) =>
        cy.wrap($vproof).type(`https://youtu.be/aefhu${i}`)
      );

      cy.get("[data-cy=form-submit-completion]").submit();
      cy.wait("@req-comp-submission")
        .its("response.statusCode")
        .should("equal", 201);
    });
  });
});
