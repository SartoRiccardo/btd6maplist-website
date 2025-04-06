describe("Submit Map", () => {
  const uid = 30;

  Cypress.Commands.add("shouldFailSubmit", () => {
    cy.get("[data-cy=form-submit-map]").submit();
    cy.get("[data-cy=sidebar-success]").should("not.exist");
  });

  beforeEach(() => {
    cy.request("https://data.ninjakiwi.com/btd6/maps/filter/newest").then(
      (response) => {
        cy.wrap(response.body.body.map(({ id }) => id)).as("test-codes");
      }
    );
    cy.request(`${Cypress.env("maplist_api_url")}/reset-test`);
    cy.login(uid);
    cy.visit("/map/submit");
    cy.intercept("POST", "/maps/submit").as("req-map-submission");
  });

  it("doesn't show the code if the code is invalid", () => {
    cy.get("input[name=code]").as("in-code").type("MLXXXAA");
    cy.get("@in-code")
      .parents("[data-cy=fgroup-map-code]")
      .find(".invalid-feedback")
      .as("err-code")
      .should("not.be.empty");
    cy.get("[data-cy=submit-map-fields]").should("not.exist");

    cy.get("@in-code").type("XXXXXXX");
    cy.get("@err-code").should("not.be.empty");
    cy.get("[data-cy=submit-map-fields]").should("not.exist");
  });

  it("doesn't submit if some fields are invalid", () => {
    cy.get("@test-codes").then((codes) => {
      cy.get("input[name=code]").type(codes[0]);
      cy.get("[data-cy=submit-map-fields]").as("ffields");
      cy.shouldFailSubmit();

      cy.get("[name=proof_completion]").selectFile(
        "public/heros/hero_ezili.webp",
        { action: "drag-drop" }
      );

      let veryLongString = "";
      for (let i = 0; i < 1_000; i++) veryLongString += "x";
      cy.get("[name=notes]").type(veryLongString, { delay: 1 });
      cy.shouldFailSubmit();
    });
  });

  Cypress.Commands.add("checkListPreload", (path, value) => {
    cy.get("@test-codes").then((codes) => {
      cy.visit(path);
      cy.get("[data-cy=btn-custom-map]").click();
      cy.get("input[name=code]").type(codes[0]);
      cy.get("[name=type]").should("have.value", value);
    });
  });

  it("autoloads the correct list when submitting", () => {
    cy.checkListPreload("/expert-list", "51");
    cy.checkListPreload("/maplist", "1");

    cy.visit("/best-of-the-best");
    cy.get("[data-cy=btn-custom-map]").should("not.exist");
  });

  describe("Submissions with various inputs", () => {
    it("can submit without writing notes", () => {
      cy.get("@test-codes").then((codes) => {
        cy.get("[data-cy=submit-map-fields]").should("not.exist");
        cy.get("input[name=code]").type(codes[0]);

        cy.get("[data-cy=sidebar-success]").should("not.exist");
        cy.get("[data-cy=sidebar-form]");
        cy.get("[data-cy=submit-map-fields]")
          .as("ffields")
          .find("[name=proof_completion]")
          .selectFile("public/heros/hero_ezili.webp", { action: "drag-drop" });

        cy.get("[data-cy=form-submit-map]").submit();
        cy.wait("@req-map-submission")
          .its("response.statusCode")
          .should("equal", 201);
        cy.get("[data-cy=sidebar-success]");
        cy.get("[data-cy=sidebar-form]").should("not.exist");
      });
    });

    it("can submit and change list and placements", () => {
      cy.get("@test-codes").then((codes) => {
        cy.get("input[name=code]").type(codes[0]);

        cy.get("[name=notes]").type("Submission notes for my map");
        cy.get("[name=proof_completion]").selectFile(
          "public/heros/hero_ezili.webp",
          { action: "drag-drop" }
        );
        cy.get("[name=type] option").should("have.length", 3);
        cy.get("[name=type]").select(2);
        cy.get("[name=proposed] option")
          .last()
          .then(($option) => {
            cy.get("[name=proposed]").select($option.text());
          });

        cy.get("[data-cy=form-submit-map]").submit();
        cy.wait("@req-map-submission")
          .its("response.statusCode")
          .should("equal", 201);
      });
    });
  });
});
