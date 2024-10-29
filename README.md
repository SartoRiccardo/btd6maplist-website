# BTD6 Maplist Website

A website for the BTD6 Maplist project.

## Running locally

You will need an instance of the [BTD6 Maplist API](https://github.com/SartoRiccardo/btd6maplist-api) running and a [Discord Application](https://discord.com/developers/applications) to run this project.

1. Clone the project and install dependencies

```bash
git clone https://github.com/SartoRiccardo/btd6maplist-website.git
cd btd6maplist-website
npm ci
```

2. Copy `.env.production` into `.env.production.ocal` and compile it out accordingly.

## Testing

This project uses Cypress for its automated tests. To run the suite, you will need:

- A [test version](https://github.com/SartoRiccardo/btd6maplist-api/tree/main-test) of the BTD6 Maplist API up and running

To start the tests:

1. Copy `.env.test` to `.env.test.local` and fill it out accordingly
2. (Optional) Change the environment variables in `cypress.env.json`
3. Build the website that points to the test API with `npm run build:test`
4. Start a test version of the website with `npm run start:test`
5. Now you can run the suite with `npm run cypress:start`

Note that this stack mocks the Discord API but does not mock the NinjaKiwi Open Data API.

If you want to use Cypress Cloud, you can use [Sorry Cypress](https://docs.sorry-cypress.dev/guide/get-started).

1. Run `docker run -p 1234:1234 agoldis/sorry-cypress-director` as per the guide linked above
2. Update the `cloudServiceUrl` in `currents.config.js` to point to your instance
