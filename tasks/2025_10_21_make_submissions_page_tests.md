# Submissions page tests

There should be a new file which contains one single test:

- The test is a User test
- The test navigates to the `/my-submissions` page
- It navigates to the page, checks that:
  1. It contains `data-cy=map-submission` elements
  2. It does not contain `data-cy=single-completion` elements
  3. It can click on `data-cy=completions-button`
  4. It contains `data-cy=single-completion` elements
  5. It does not contain `data-cy=map-submission` elements
  6. It can click on `data-cy=map-button`
  7. It contains `data-cy=map-submission` elements

Look at the other tests to see how to login, reset the API state, etc.
