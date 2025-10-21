describe("My Submissions page", () => {
    const uid = 30;

    beforeEach(() => {
        cy.request(`${Cypress.env("maplist_api_url")}/reset-test`);
        cy.login(uid);
    });

    it("can navigate between map and completion submissions", () => {
        cy.visit("/my-submissions");

        cy.get("[data-cy=map-submission]").should("exist");
        cy.get("[data-cy=single-completion]").should("not.exist");

        cy.get("[data-cy=completions-button]").click();

        cy.get("[data-cy=single-completion]").should("exist");
        cy.get("[data-cy=map-submission]").should("not.exist");

        cy.get("[data-cy=map-button]").click();

        cy.get("[data-cy=map-submission]").should("exist");
    });
});
