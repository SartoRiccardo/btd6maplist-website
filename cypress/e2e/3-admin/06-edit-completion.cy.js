describe("Edit/Add Completions", () => {
  const uid = 30;

  Cypress.Commands.add("completion", (source) => {
    if (source === "pending") cy.visit("/completions/pending");
    if (/[A-Z]{7}/.test(source)) cy.visit(`/map/${source}`);
    if (/\d+/.test(source)) cy.visit(`/user/${source}`);

    cy.get("[data-cy=single-completion]")
      .first()
      .find("[data-cy=btn-completion-edit]")
      .click();
    cy.location("pathname").should("match", /\/completions\/\d+/);
  });

  const testEditCompletion = (source) => {
    if (source === "pending") cy.completion("pending");
    else if (source === "map-page") cy.completion("MLXXXBA");
    cy.get("[data-cy=form-edit-completion]").submit();
    cy.wait("@req-submit-completion")
      .its("response.statusCode")
      .should("equal", 204);
    cy.get("[data-cy=toast-success]");

    if (source === "pending") cy.completion("pending");
    else if (source === "map-page") cy.completion("MLXXXAI");
    cy.get("[name=format]").select(1);
    cy.get("[name=black_border]").check();
    cy.get("[name=no_geraldo]").check();
    cy.get('[name="lcc.leftover"]').type("{selectAll}{del}90000");
    cy.get("[data-cy=btn-toggle-lcc]").click();

    cy.get("[data-cy=form-edit-completion]").submit();
    cy.wait("@req-submit-completion")
      .its("response.statusCode")
      .should("equal", 204);
    cy.get("[data-cy=toast-success]");
  };

  const testDeleteCompletion = () => {
    cy.intercept("DELETE", /\/completions\/\d+/).as("req-delete");
    cy.get("[data-cy=btn-delete]").click();
    cy.get("[data-cy=btn-delete-confirm]").click();
    cy.wait("@req-delete").its("response.statusCode").should("equal", 204);
  };

  const testInvalidCompletion = () => {
    cy.get("[data-cy=form-edit-completion]").as("form");

    cy.get("[data-cy=btn-toggle-lcc]").click();
    cy.get('[name="lcc.leftover"]')
      .as("in-leftover")
      .type("{selectAll}{del}invalid");
    cy.get("@form").failSubmit();
    cy.get("@in-leftover")
      .parents("[data-cy=form-group]")
      .find(".invalid-feedback")
      .should("not.be.empty");
    cy.get("[data-cy=btn-toggle-lcc]").click();

    cy.get('[name="user_ids[0].uid"]').as("in-uid0").type("nonexistent");
    cy.get("@form").failSubmit();
    cy.wait("@req-submit-completion")
      .its("response.statusCode")
      .should("equal", 400);
    cy.get("@in-uid0")
      .parents("[data-cy=form-group]")
      .find(".invalid-feedback")
      .as("err-uid0")
      .should("not.be.empty");

    cy.get("@in-uid0").type("{selectAll}{del}");
    cy.get("@err-uid0").should("not.be.empty");
    cy.get("@form").failSubmit();
  };

  const testInsertSelf = () => {
    cy.get('[name="user_ids[0].uid"]')
      .as("in-uid0")
      .type(`{selectAll}{del}${uid}`);
    cy.get("[data-cy=form-edit-completion]").failSubmit();
    cy.wait("@req-submit-completion")
      .its("response.statusCode")
      .should("equal", 403);
    cy.get("[data-cy=toast-error]");
  };

  before(() => {
    cy.resetApi();
  });

  beforeEach(() => {
    cy.login(uid, 64);
  });

  describe("Edit completions", () => {
    it("can edit a completion", () => {
      cy.intercept("PUT", /\/completions\/\d+/).as("req-submit-completion");
      testEditCompletion("map-page");
    });

    it("can delete a completion", () => {
      cy.completion("16");
      testDeleteCompletion();
    });

    it("doesn't submit if some fields are invalid", () => {
      cy.intercept("PUT", /\/completions\/\d+/).as("req-submit-completion");
      cy.visit("/completions/73");
      testInvalidCompletion();
    });

    it("can't edit one's own completion", () => {
      cy.intercept("PUT", /\/completions\/\d+/).as("req-submit-completion");

      cy.completion("MLXXXCC");
      testInsertSelf();

      cy.completion(`${uid}`);
      cy.get("[name^=user_ids]").each(($inputUid, i) => {
        cy.wrap($inputUid).type(`{selectAll}{del}${i + 1}`);
      });
      cy.get("[data-cy=form-edit-completion]").failSubmit();
      cy.wait("@req-submit-completion")
        .its("response.statusCode")
        .should("equal", 403);
      cy.get("[data-cy=toast-error]");
    });

    it("autofills", () => {
      cy.visit("/completions/108");
      cy.get("[name=black_border]").should("be.checked");
      cy.get("[name=no_geraldo]").should("be.checked");
      cy.get('[name="lcc.leftover"]')
        .should("not.be.disabled")
        .and("have.value", "10177");
      cy.get("[name^=user_ids]").should("have.length", 3);
      const expectedUsers = [45, 11, 1];
      for (let i = 0; i < expectedUsers.length; i++)
        cy.get("[name^=user_ids]")
          .eq(i)
          .should("have.value", `usr${expectedUsers[i]}`);
    });
  });

  describe("Accept completions", () => {
    it("can accept and edit a submission", () => {
      cy.intercept("PUT", /\/completions\/\d+\/accept/).as(
        "req-submit-completion"
      );
      testEditCompletion("pending");
    });

    it("can delete a submission", () => {
      cy.completion("pending");
      testDeleteCompletion();
    });

    it("doesn't submit if some fields are invalid", () => {
      cy.intercept("PUT", /\/completions\/\d+\/accept/).as(
        "req-submit-completion"
      );
      cy.visit("/completions/54");
      testInvalidCompletion();
    });

    it("can't accept one's own completion", () => {
      cy.intercept("PUT", /\/completions\/\d+\/accept/).as(
        "req-submit-completion"
      );
      cy.visit("/completions/54");
      testInsertSelf();
    });
  });

  describe("Add completions", () => {
    it("can add a completion", () => {
      cy.visit("/map/MLXXXAA");
      cy.get("[data-cy=btn-insert-completion]").click();
      cy.location("pathname").should("equal", "/map/MLXXXAA/completions/new");

      cy.intercept("POST", "/maps/MLXXXAA/completions").as(
        "req-add-completion"
      );
      cy.get("[data-cy=form-edit-completion]").as("form").failSubmit();
      cy.get("@form")
        .find(
          ".invalid-feedback:not(:empty), [data-cy=invalid-feedback]:not(:empty)"
        )
        .should("have.length", 2);

      cy.get("[name^=user_ids]")
        .parents("[data-cy=addable-field]")
        .as("fgroup-uid")
        .find("[data-cy=btn-remove-field]")
        .should("not.exist");
      for (let i = 0; i < 3; i++)
        cy.get("@fgroup-uid").find("[data-cy=btn-addable-field]").click();
      cy.get("@fgroup-uid")
        .find("[data-cy=btn-remove-field]")
        .should("have.length", 4);
      cy.get("@fgroup-uid").find("[data-cy=btn-remove-field]").eq(2).click();
      cy.get("[name^=user_ids]").each(($input, i) =>
        cy.wrap($input).type(`usr${i + 1}`)
      );

      cy.get("[name=subm_proof]").fillImages();
      cy.get("@form").submit();
      cy.wait("@req-add-completion")
        .its("response.statusCode")
        .should("equal", 201);
    });

    it("can add a completion without an image", () => {
      cy.visit("/map/MLXXXAA/completions/new");
      cy.intercept("POST", "/maps/MLXXXAA/completions").as(
        "req-add-completion"
      );

      cy.get("[name^=user_ids]").each(($input, i) =>
        cy.wrap($input).type(`usr${i + 1}`)
      );
      cy.get("[data-cy=btn-toggle-lcc]").click();
      cy.get('[name="lcc.leftover"]').type("{selectAll}{del}90000");
      cy.get("[name=has_no_image]").check();
      cy.get("[data-cy=form-edit-completion]").submit();
      cy.wait("@req-add-completion")
        .its("response.statusCode")
        .should("equal", 201);
    });

    it("doesn't submit if some fields are invalid", () => {
      cy.intercept("POST", "/maps/MLXXXAA/completions").as(
        "req-submit-completion"
      );
      cy.visit("/map/MLXXXAA/completions/new");

      cy.get("[name=has_no_image]").check();
      testInvalidCompletion();
      cy.get("[name=has_no_image]").uncheck();
      cy.get("[name=subm_proof]").fillImages("big_broken_image.png");
      cy.get("@form").failSubmit();
    });

    it("can't add a completions to oneself", () => {
      cy.intercept("POST", "/maps/MLXXXAA/completions").as(
        "req-submit-completion"
      );
      cy.visit("/map/MLXXXAA/completions/new");

      cy.get("[name=has_no_image]").check();
      testInsertSelf();
    });
  });
});
