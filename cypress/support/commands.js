// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// https://stackoverflow.com/a/65561176/13033269
Cypress.Commands.add("clickOutside", () => {
  return cy.get("body").click(0, 0);
});

// https://stackoverflow.com/a/68871590/13033269
Cypress.Commands.add("clipboard", () => {
  return cy.window().then((win) => cy.wrap(win.navigator.clipboard.readText()));
});

Cypress.Commands.add("failSubmit", { prevSubject: "element" }, (subject) => {
  cy.wrap(subject).submit();
  cy.get("[data-cy=toast-success]").should("not.exist");
});

Cypress.Commands.add("resetApi", () => {
  return cy.request(`${Cypress.env("maplist_api_url")}/reset-test`);
});

Cypress.Commands.add(
  "login",
  (
    userId,
    { permissions = { "!basic": null }, roles = [], unauthorized = false } = {}
  ) => {
    const permList = Object.keys(permissions)
      .map(
        (permName) => `${permName}/${permissions[permName]?.join(",") ?? ""}`
      )
      .concat(roles.map((roleId) => `@${roleId}`));
    const permParam = encodeURIComponent(permList.join("+"));

    const url = unauthorized
      ? "/api/auth?code=mock_discord_code"
      : `/api/auth?code=mock_discord_code_${userId}_${permParam}`;
    return cy.visit(url);
  }
);

Cypress.Commands.add(
  "fillImages",
  { prevSubject: "element" },
  ($elements, fileName = null, opts = null) => {
    let options = {
      onlyOne: false,
    };
    if (opts !== null)
      options = {
        ...options,
        ...opts,
      };

    const filePath = `cypress/images/${fileName || "submittable_image.webp"}`;
    if (options.onlyOne) {
      cy.wrap($elements).first().selectFile(filePath, { action: "drag-drop" });
    } else {
      cy.wrap($elements).each(($proof) => {
        cy.wrap($proof).selectFile(filePath, { action: "drag-drop" });
      });
    }
  }
);
