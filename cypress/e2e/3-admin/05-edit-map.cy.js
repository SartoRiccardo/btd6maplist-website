import { veryLongString } from "../../support/helpers";

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

  const fillMapForm = (mapName) => {
    cy.get("[data-cy=btn-hero][data-cy-active=true]").as("hero-active");
    cy.get("[data-cy=btn-hero][data-cy-active=false]").then(($allInactive) => {
      cy.get("[data-cy=btn-hero][data-cy-active=true]").each(($active) =>
        cy.wrap($active).click()
      );
      cy.wrap($allInactive).each(($inactive) => cy.wrap($inactive).click());
    });

    cy.get("[data-cy-name=aliases][data-cy=addable-field]").as(
      "fgroup-aliases"
    );
    for (let i = 0; i < 4; i++)
      cy.get("@fgroup-aliases").find("[data-cy=btn-addable-field]").click();
    cy.get("[name^=aliases]").then(($aliases) => {
      cy.wrap($aliases).each(($alias, i) => {
        if (i <= $aliases.length - 4 || i >= $aliases.length - 1) return;
        cy.wrap($alias).type(`{selectAll}{del}new_alias_${mapName}_${i + 1}`);
      });
    });

    cy.get("[data-cy=addable-field][data-cy-name=creators]").as(
      "fgroup-creators"
    );
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
      cy.get("[name^=additional_codes]").fillFields([codes[0], "Playtesting"]);
    });

    cy.get("[data-cy=fgroup-verifiers]").as("fgroup-verifiers");
    cy.get("@fgroup-verifiers").addRemoveField(2);
    cy.get("[name^=verifiers]").fillFields(["usr13", null, "usr11", "44.1"]);
  };

  const testInvalidFields = () => {
    cy.get("[data-cy=form-edit-map]")
      .as("form")
      .get("[name=difficulty]")
      .select(1);

    // Creators
    cy.get("[data-cy=addable-field][data-cy-name=creators]")
      .as("fgroup-creators")
      .find("[data-cy=btn-addable-field]")
      .click();

    cy.get("@fgroup-creators")
      .find('[name^=creators][name$=".id"]')
      .last()
      .as("in-creat-id")
      .parents("[data-cy=form-group]")
      .find(".invalid-feedback")
      .as("err-creat-id");
    cy.get("@fgroup-creators")
      .find('[name^=creators][name$=".role"]')
      .last()
      .as("in-creat-role")
      .parents("[data-cy=form-group]")
      .find(".invalid-feedback")
      .as("err-creat-role");

    cy.get("@in-creat-id").type("{selectAll}{del}nonexistent");
    cy.get("@form").failSubmit();
    cy.wait("@req-submit").its("response.statusCode").should("equal", 400);
    cy.get("@err-creat-id").should("not.be.empty");

    cy.get("@in-creat-id").type("{selectAll}{del}usr30");
    cy.get("@in-creat-role").type("{selectAll}{del}" + veryLongString(200), {
      delay: 1,
    });
    cy.get("@form").failSubmit();
    cy.get("@err-creat-role").should("not.be.empty");

    cy.get("@in-creat-role").type("{selectAll}{del}Gameplay");
    cy.get("@in-creat-id");
    cy.get("[data-cy=addable-field][data-cy-name=creators]")
      .as("fgroup-creators")
      .find("[data-cy=btn-addable-field]")
      .click();
    cy.get("@in-creat-id").type("{selectAll}{del}usr30");
    cy.get("@form").failSubmit();
    cy.get("@err-creat-id").should("not.be.empty");

    cy.get("@in-creat-id").type("{selectAll}{del}usr10");

    // Sidebar
    const intFields = ["placement_allver", "placement_curver"];
    for (const field of intFields) {
      cy.get(`[name=${field}]`).type("{selectAll}{del}-1");
      cy.get("@form").failSubmit();
      cy.get(`[name=${field}]`)
        .parents("[data-cy=form-group]")
        .find(".invalid-feedback")
        .as("err-msg")
        .should("not.be.empty");

      cy.get(`[name=${field}]`).type("{selectAll}{del}100000");
      cy.get("@form").failSubmit();
      cy.get("@err-msg").should("not.be.empty");

      cy.get(`[name=${field}]`).type("{selectAll}{del}5");
    }

    cy.get("[name=r6_start]").type("{selectAll}{del}notaurl");
    cy.get("@form").failSubmit();
    cy.get("[name=r6_start]").type(
      "{selectAll}{del}https://example.com/" + veryLongString(500),
      {
        delay: 1,
      }
    );
    cy.get(`[name=r6_start]`)
      .parents("[data-cy=form-group]")
      .find(".invalid-feedback")
      .should("not.be.empty");
    cy.get("[name=r6_start]").type("{selectAll}{del}");

    const imgFields = ["map_preview_file", "r6_start_file"];
    for (const field of imgFields) {
      cy.get(`[name=${field}]`).as("field").fillImages("big_broken_image.png");
      cy.get("@field")
        .parents("[data-cy=form-group]")
        .find(".invalid-feedback")
        .should("not.be.empty");

      cy.get("@field").fillImages();
    }

    // Aliases
    cy.get("[data-cy-name=aliases][data-cy=addable-field]").as(
      "fgroup-aliases"
    );
    cy.get("@fgroup-aliases").find("[data-cy=btn-addable-field]").click();
    cy.get("@fgroup-aliases")
      .find("[name^=aliases]")
      .last()
      .as("in-alias")
      .type("{selectAll}{del}" + veryLongString(300), { delay: 1 });
    cy.get("@in-alias")
      .parents("[data-cy=form-group]")
      .find(".invalid-feedback")
      .as("err-alias")
      .should("not.be.empty");

    cy.get("@in-alias").type("{selectAll}{del}ml10");
    cy.get("@form").failSubmit();
    cy.wait("@req-submit").its("response.statusCode").should("equal", 400);
    cy.get("@err-alias").should("not.be.empty");

    cy.get("@in-alias").type("{selectAll}{del}repeated");
    cy.get("@fgroup-aliases").find("[data-cy=btn-addable-field]").click();
    cy.get("@in-alias").type("{selectAll}{del}repeated");
    cy.wrap("@err-alias").should("not.be.empty");
    cy.get("@form").failSubmit();
    cy.wait("@req-submit").its("response.statusCode").should("equal", 400);
    cy.get("@in-alias").type("{selectAll}{del}");

    // Additional Codes
    cy.get("[data-cy=addable-field][data-cy-name=additional_codes]")
      .as("fgroup-addcodes")
      .find("[data-cy=btn-addable-field]")
      .click();

    cy.get("@fgroup-addcodes")
      .find('[name^=additional_codes][name$=".code"]')
      .last()
      .as("in-addcode-code")
      .parents("[data-cy=form-group]")
      .find(".invalid-feedback")
      .as("err-addcode-code");
    cy.get("@fgroup-addcodes")
      .find('[name^=additional_codes][name$=".description"]')
      .last()
      .as("in-addcode-desc")
      .parents("[data-cy=form-group]")
      .find(".invalid-feedback")
      .as("err-addcode-desc");

    cy.get("@in-addcode-desc").type("{selectAll}{del}" + veryLongString(200), {
      delay: 1,
    });
    cy.get("@err-addcode-desc").should("not.be.empty");
    cy.get("@in-addcode-desc").type("{selectAll}{del}Redeco");

    cy.get("@in-addcode-code").type("{selectAll}{del}XXXXXXX");
    cy.get("@form").failSubmit();
    cy.wait("@req-submit").its("response.statusCode").should("equal", 400);
    cy.get("@err-addcode-code").should("not.be.empty");

    cy.get("@in-addcode-code").type("{selectAll}{del}X");
    cy.get("@form").failSubmit();
    cy.wait("@req-submit").its("response.statusCode").should("equal", 400);
    cy.get("@err-addcode-code").should("not.be.empty");

    cy.get("@in-addcode-code").type("{selectAll}{del}MLXXXAA");
    cy.get("@fgroup-addcodes").find("[data-cy=btn-addable-field]").click();
    cy.get("@in-addcode-desc").type("{selectAll}{del}Redeco");
    cy.get("@in-addcode-code").type("{selectAll}{del}MLXXXAA");
    cy.get("@err-addcode-code").should("not.be.empty");
    cy.get("@fgroup-addcodes")
      .find("[data-cy=btn-remove-field]")
      .each(($btn) => cy.wrap($btn).click());

    // Verifiers
    cy.get("[data-cy=addable-field][data-cy-name=verifiers]")
      .as("fgroup-verifiers")
      .find("[data-cy=btn-addable-field]")
      .click();

    cy.get("@fgroup-verifiers")
      .find('[name^=verifiers][name$=".id"]')
      .last()
      .as("in-verifiers-id")
      .parents("[data-cy=form-group]")
      .find(".invalid-feedback")
      .as("err-verifiers-id");
    cy.get("@fgroup-verifiers")
      .find('[name^=verifiers][name$=".version"]')
      .last()
      .as("in-verifiers-version")
      .parents("[data-cy=form-group]")
      .find(".invalid-feedback")
      .as("err-verifiers-version");

    cy.get("@in-verifiers-id").type("{selectAll}{del}nonexistent");
    cy.get("@form").failSubmit();
    cy.wait("@req-submit").its("response.statusCode").should("equal", 400);
    cy.get("@err-verifiers-id").should("not.be.empty");

    cy.get("@in-verifiers-id").type("{selectAll}{del}usr40");
    cy.get("@in-verifiers-version").type("{selectAll}{del}nonnumeric");
    cy.get("@form").failSubmit();
    cy.get("@err-verifiers-version").should("not.be.empty");

    cy.get("@in-verifiers-version").type("{selectAll}{del}45.1");

    // Version Compatibilities
    cy.get("[data-cy=addable-field][data-cy-name=version_compatibilities]")
      .as("fgroup-vcompat")
      .find("[data-cy=btn-addable-field]")
      .click();

    cy.get("@fgroup-vcompat")
      .find('[name^=version_compatibilities][name$=".version"]')
      .last()
      .as("in-vcompat-version")
      .parents("[data-cy=form-group]")
      .find(".invalid-feedback")
      .as("err-vcompat-version");

    cy.get("@in-vcompat-version").type("{selectAll}{del}nonnumeric");
    cy.get("@form").failSubmit();
    cy.get("@err-vcompat-version").should("not.be.empty");
    cy.get("@in-verifiers-version").type("{selectAll}{del}45.1");
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

  beforeEach(() => {
    cy.resetApi();
    cy.login(uid, 64);
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
      fillMapForm("mlmap_bc");

      cy.get("@form").submit();
      cy.wait("@req-edit-map").its("response.statusCode").should("equal", 204);
    });

    it("doesn't submit if some fields are invalid", () => {
      cy.visit("/map/MLXXXBC/edit");
      cy.intercept("PUT", /maps\/.+?/).as("req-submit");
      testInvalidFields();
    });

    it("can delete a map", () => {
      cy.intercept("DELETE", /maps\/.+?/).as("req-delete-map");
      cy.visit("/map/MLXXXAG/edit");

      cy.get("[data-cy=btn-delete]").click();
      cy.get("[data-cy=btn-delete-confirm]").click();

      cy.wait("@req-delete-map")
        .its("response.statusCode")
        .should("equal", 204);

      cy.visit("/map/MLXXXAG/edit");
      cy.get("[data-cy=btn-delete]").should("not.exist");
    });
  });

  describe("Transfer a map's completions", () => {
    it("can transfer completions", () => {
      cy.intercept("PUT", "/maps/DELXXAH/completions/transfer").as(
        "req-transfer"
      );

      cy.visit("/map/DELXXAH/edit");
      cy.get("[data-cy=form-transfer-completions]")
        .as("form")
        .find("[name=code]")
        .type("MLXXXAA");
      cy.get("@form").find("[data-cy=btn-transfer]").click();
      cy.get("[data-cy=btn-cancel]").click();
      cy.get("@form").find("[data-cy=btn-transfer]").click();
      cy.get("[data-cy=btn-transfer-confirm]").click();

      cy.wait("@req-transfer").its("response.statusCode").should("equal", 204);
    });

    it("validates the map to be transferred to", () => {
      cy.visit("/map/DELXXAD/edit");
      cy.get("[data-cy=form-transfer-completions]")
        .as("form")
        .find("[name=code]")
        .as("in-code")
        .type("XXXXXXX");
      cy.get("@form").failSubmit();
      cy.get("@in-code")
        .parents("[data-cy=fgroup-map-code]")
        .find(".invalid-feedback")
        .as("err-code")
        .should("not.be.empty");

      cy.get("@in-code").type("X");
      cy.get("@err-code").should("not.be.empty");
      cy.get("@form").failSubmit();
    });

    it("doesn't diplay on non-deleted maps", () => {
      cy.visit("/map/MLXXXAA/edit");
      cy.get("[data-cy=form-transfer-completions]").should("not.exist");
    });
  });

  describe("Add a map", () => {
    it("can add a map", () => {
      cy.request("https://data.ninjakiwi.com/btd6/maps/filter/newest").then(
        (response) => {
          cy.wrap(response.body.body.map(({ id }) => id)).as("test-codes");
        }
      );

      cy.intercept("POST", "/maps").as("req-add-map");

      cy.visit("/expert-list");
      cy.get("[data-cy=btn-custom-map]").eq(0).click();
      cy.location("pathname").should("equal", "/map/add");

      cy.get("@test-codes").then((codes) => {
        cy.get("[name=code]").type(codes[0]);
      });
      cy.get("[name=difficulty]").select(2);
      cy.get("[name^=creators]").eq(0).type("usr20");
      cy.get("[data-cy=form-edit-map]").submit();
      cy.wait("@req-add-map").its("response.statusCode").should("equal", 201);

      cy.visit("/maplist");
      cy.get("[data-cy=btn-custom-map]").eq(0).click();
      cy.location("pathname").should("equal", "/map/add");

      cy.get("@test-codes").then((codes) => {
        cy.get("[name=code]").type(codes[1]);
      });
      cy.get("[name=placement_curver]").type("{selectAll}{del}1");
      cy.get("[name=placement_allver]").type("{selectAll}{del}5");
      fillMapForm("mlmap_new1");
      cy.get("[data-cy=form-edit-map]").submit();
      cy.wait("@req-add-map").its("response.statusCode").should("equal", 201);
    });

    it("doesn't submit if some fields are invalid", () => {
      cy.visit("/map/add");
      cy.intercept("POST", "/maps").as("req-submit");
      cy.request("https://data.ninjakiwi.com/btd6/maps/filter/newest").then(
        (response) => {
          cy.get("[name=code]").type(response.body.body[0].id);
          testInvalidFields();
        }
      );
    });

    describe("Map code controller", () => {
      it("doesn't show the code if the code is invalid", () => {
        cy.visit("/map/add");
        cy.get("[name=code]")
          .parents("[data-cy=fgroup-map-code]")
          .find(".invalid-feedback")
          .as("err-code");

        cy.get("[name=code]").type("XXXXXXX");
        cy.get("@err-code").should("not.be.empty");
        cy.get("button[type=submit]").should("not.exist");

        cy.get("[name=code]").type("X");
        cy.get("@err-code").should("not.be.empty");
        cy.get("button[type=submit]").should("not.exist");
      });

      it("shows the edit map form if adding a map that already exists", () => {
        cy.visit("/map/add");
        cy.get("[name=code]").type("MLXXXAA");
        cy.get("[data-cy=form-edit-map]")
          .find("button[type=submit]")
          .should("have.text", "Save");
      });
    });
  });
});
