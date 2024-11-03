describe("Edit Maps", () => {
  const uid = 30;

  const arrayInString = (str, arr) => {
    for (const item of arr) {
      if (str.includes(item)) {
        return true;
      }
    }
    return false;
  };

  before(() => {
    cy.request(`${Cypress.env("maplist_api_url")}/reset-test`);
  });

  beforeEach(() => {
    cy.visit(`/api/auth?code=mock_discord_code_${uid}_64`);
  });

  describe("Edit a map", () => {
    it("autofills", () => {
      cy.visit("/map/MLXXXED/edit");

      cy.get("[name=placement_curver]").should("have.value", "44");
      cy.get("[name=placement_allver]").should("have.value", "39");
      cy.get("[name=difficulty]").should("have.value", "0");
      cy.get("[name=r6_start]").should(
        "have.value",
        "https://drive.google.com/file/d/qWpmWHvTUJMEhyxBNiZTsMJjOHJfLFdY/view"
      );
      cy.get("[name=map_preview_file]")
        .find("img")
        .should("have.attr", "src")
        .and("equal", "https://dummyimage.com/250x150/9966cc/fff");

      const expectedOptimal = ["rosalia", "geraldo"];
      cy.get("[data-cy=btn-hero]")
        .find("img")
        .each(($img) => {
          cy.wrap($img)
            .parents("[data-cy=btn-hero]")
            .should("have.attr", "data-cy-active")
            .and(
              "equal",
              arrayInString($img.attr("src"), expectedOptimal).toString()
            );
        });

      const expectedCreat = ["usr12", "Decoration", "usr30", "Gameplay"];
      cy.get("[name^=creators]").each(($input, i) => {
        cy.wrap($input).should("have.value", expectedCreat[i]);
      });

      const expectedAlias = [
        "ml44",
        "ml_44",
        "Maplist Map 39",
        "MLXXX39",
        "39",
        "@5",
      ];
      cy.get("[name^=aliases]").each(($input, i) => {
        cy.wrap($input).should("have.value", expectedAlias[i]);
      });

      const expectedCodes = ["MLA1X44", "Additional Code 1"];
      cy.get("[name^=additional_codes]").each(($input, i) => {
        cy.wrap($input).should("have.value", expectedCodes[i]);
      });

      const expectedVerifiers = [
        "usr10",
        "usr12",
        null,
        "usr10",
        "44.1",
        "usr12",
        "44.1",
      ];
      cy.get("[name^=verifiers]").each(($input, i) => {
        cy.wrap($input).should("have.value", expectedVerifiers[i] || "");
      });
    });

    it("can edit a map", () => {});

    it("doesn't submit if some fields are invalid", () => {});

    it("can delete a map", () => {});
  });

  describe.skip("Transfer a map's completions", () => {
    it("can transfer completions", () => {});

    it("validates the map to be transferred to", () => {});

    it("doesn't diplay on non-deleted maps", () => {});
  });

  describe.skip("Add a map", () => {
    it("can add a map", () => {});

    it("doesn't submit if some fields are invalid", () => {});

    it("shows the edit map form if adding a map that already exists", () => {});
  });
});
