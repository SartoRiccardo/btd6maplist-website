describe("Edit Config Variables", () => {
  const uid = 30;

  const insertTestValues = (vals) => {
    for (const field of Object.keys(vals)) {
      cy.get("@form")
        .find(`[name=${field}]`)
        .type(`{selectAll}{del}${vals[field]}`);
    }
  };

  const checkInvalidity = (names) => {
    for (const field of names) {
      cy.get("@form")
        .find(`[name=${field}]`)
        .parents("[data-cy=form-group]")
        .find(".invalid-feedback")
        .should("not.be.empty");
    }
  };

  before(() => {
    cy.request(`${Cypress.env("maplist_api_url")}/reset-test`);
  });

  beforeEach(() => {
    cy.visit(`/api/auth?code=mock_discord_code_${uid}_64`);
    cy.visit("/config");
    cy.intercept("PUT", "/config").as("req-edit-config");
  });

  describe("Maplist config", () => {
    beforeEach(() => {
      cy.get("[data-cy=form-maplist-config]").find("form").as("form");
    });

    it("can edit config variables", () => {
      const testValues = {
        points_top_map: "90",
        points_bottom_map: "1",
        formula_slope: "0.9",
        points_extra_lcc: "19",
        points_multi_gerry: "4",
        points_multi_bb: "5",
        decimal_digits: "2",
        map_count: "30",
        current_btd6_ver: "45.2",
      };

      insertTestValues(testValues);
      cy.get("@form").submit();
      cy.wait("@req-edit-config")
        .its("response.statusCode")
        .should("equal", 200);
      cy.get("[data-cy=toast-success]");
    });

    it("doesn't submit if some fields are invalid", () => {
      const testValues = {
        points_top_map: "a",
        points_bottom_map: "a",
        formula_slope: "a",
        points_extra_lcc: "a",
        points_multi_gerry: "a",
        points_multi_bb: "a",
        decimal_digits: "2.1",
        map_count: "30.1",
        current_btd6_ver: "45..2",
      };

      insertTestValues(testValues);
      cy.get("@form").failSubmit();
      checkInvalidity(Object.keys(testValues));
    });
  });

  describe("Expert config", () => {
    beforeEach(() => {
      cy.get("[data-cy=form-experts-config]").find("form").as("form");
    });

    it("can edit config variables", () => {
      const testValues = {
        current_btd6_ver: "45.1",
        exp_points_casual: "7",
        exp_points_medium: "7",
        exp_points_high: "7",
        exp_points_true: "7",
        exp_points_extreme: "7",
      };

      insertTestValues(testValues);
      cy.get("@form").submit();
      cy.wait("@req-edit-config")
        .its("response.statusCode")
        .should("equal", 200);
      cy.get("[data-cy=toast-success]");
    });

    it("doesn't submit if some fields are invalid", () => {
      const testValues = {
        current_btd6_ver: "45..1",
        exp_points_casual: "7.1",
        exp_points_medium: "7.1",
        exp_points_high: "7.1",
        exp_points_true: "7.1",
        exp_points_extreme: "7.1",
      };

      insertTestValues(testValues);
      cy.get("@form").failSubmit();
      checkInvalidity(Object.keys(testValues));
    });
  });
});
