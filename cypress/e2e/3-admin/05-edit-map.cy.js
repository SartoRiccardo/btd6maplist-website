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

  Cypress.Commands.add(
    "fillFields",
    { prevSubject: "element" },
    ($selector, values) => {
      cy.wrap($selector).then(($inputs) => {
        for (let i = 0; i < values.length; i++) {
          if (values[i])
            cy.wrap($inputs)
              .eq($inputs.length - values.length + i)
              .type(values[i] || "");
        }
      });
    }
  );

  Cypress.Commands.add(
    "addRemoveField",
    { prevSubject: "element" },
    ($selector, amount) => {
      for (let i = 0; i < amount + 1; i++)
        cy.wrap($selector).find("[data-cy=btn-addable-field]").click();
      cy.wrap($selector).find("[data-cy=btn-remove-field]").last().click();
    }
  );

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

    it("can edit a map", () => {
      cy.request("https://data.ninjakiwi.com/btd6/maps/filter/newest").then(
        (response) => {
          cy.wrap(response.body.body.map(({ id }) => id)).as("test-codes");
        }
      );

      cy.intercept("PUT", /maps\/.+?/).as("req-edit-map");
      cy.visit("/map/MLXXXAG");
      cy.get("[data-cy=btn-edit-map]").click();
      cy.location("pathname").should("equal", "/map/MLXXXAG/edit");

      cy.wait(1000);
      cy.get("[data-cy=form-edit-map]").as("form").submit();
      cy.wait("@req-edit-map").its("response.statusCode").should("equal", 204);

      cy.visit("/map/MLXXXBC/edit");
      cy.get("[name=difficulty]").select(2);
      cy.get("[name=placement_curver]").type("{selectAll}{del}1");
      cy.get("[name=placement_allver]").type("{selectAll}{del}1");
      cy.get("[data-cy=btn-hero][data-cy-active=true]").as("hero-active");
      cy.get("[data-cy=btn-hero][data-cy-active=false]").then(
        ($allInactive) => {
          cy.get("[data-cy=btn-hero][data-cy-active=true]").each(($active) =>
            cy.wrap($active).click()
          );
          cy.wrap($allInactive).each(($inactive) => cy.wrap($inactive).click());
        }
      );

      cy.get("[name^=aliases]")
        .parents("[data-cy=addable-field]")
        .as("fgroup-aliases");
      for (let i = 0; i < 4; i++)
        cy.get("@fgroup-aliases").find("[data-cy=btn-addable-field]").click();
      cy.get("[name^=aliases]").then(($aliases) => {
        cy.wrap($aliases).each(($alias, i) => {
          if (i <= $aliases.length - 4 || i >= $aliases.length - 1) return;
          cy.wrap($alias).type(`{selectAll}{del}new_alias${i + 1}`);
        });
      });

      cy.get("[name^=creators]")
        .parents("[data-cy=addable-field]")
        .as("fgroup-creators");
      cy.get("@fgroup-creators").addRemoveField(2);
      cy.get("[name^=creators]").fillFields([
        "usr13",
        null,
        "usr11",
        "Playtesting",
      ]);

      cy.get("[data-cy=fgroup-additional-codes]").as("fgroup-addcodes");
      cy.get("@fgroup-addcodes").addRemoveField(1);
      cy.get("@test-codes").then((codes) => {
        cy.get("[name^=additional_codes]").fillFields([
          codes[0],
          "Playtesting",
        ]);
      });

      cy.get("[data-cy=fgroup-verifiers]").as("fgroup-verifiers");
      cy.get("@fgroup-verifiers").addRemoveField(2);
      cy.get("[name^=verifiers]").fillFields(["usr13", null, "usr11", "44.1"]);

      cy.get("@form").submit();
      cy.wait("@req-edit-map").its("response.statusCode").should("equal", 204);
    });

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
