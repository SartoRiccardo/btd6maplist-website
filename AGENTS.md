# Bloons TD 6 Frontend

This is a standard NextJS project for the Bloons TD 6 Maplist website.

## Overview

Other than standard NextJS framework rules, the project follows the following conventions:

- The `formik` library for form validation
- Server-side rendering is used whenever possible
- The `server/maplistRequests.js` holds all server-side request methods, while `server/maplistRequests.client.js` holds all methods called client-side.
- There are global redux stores. These are basically glorified global variables and are in `src/lib/store.js`
- The project is in vanilla Javascript (other than React)
- Many common components to render common things such as completions and maps are already available: they are in `components/maps`.
