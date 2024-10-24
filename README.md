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

2. Copy `.env` into `.env.local` or `.env.production` and fill it out accordingly.

## Testing

This project uses Cypress for its automated tests. To run the suite, you will need:

- A [test version](https://github.com/SartoRiccardo/btd6maplist-api/tree/main-test) of the BTD6 Maplist API up and running
- An instance of [Sorry Cypress](https://docs.sorry-cypress.dev/guide/get-started) running
  - You you can run `docker run -p 1234:1234 agoldis/sorry-cypress-director` as per the guide
  - You will need to update the `cloudServiceUrl` in `currents.config.js` to point to your instance
