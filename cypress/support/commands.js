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

Cypress.Commands.add("login", (userId, perms) => {
  return cy.visit(`/api/auth?code=mock_discord_code_${userId}_${perms}`);
});
