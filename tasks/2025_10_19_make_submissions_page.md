# Submissions Page

Make a submissions page.

When a user clicks their own profile in the navbar another option should appear which is "My submissions" between Profile and Logout, which takes to the `/my-submissions` page. This page is only visible if the user is logged in (so apply the appropriate middleware to it), and it should display the following:

1. A "My Submissions" header
2. Two buttons to toggle between maps and completions, respectively
3. The list of submitted completions/maps, depending on what is selected.

Submitted maps should have the following border colors:

- Default, if pending
- Red, if rejected
- Green, if accepted

Submitted completion submissions have a similar border, except it's only on the side.

Use the map submission & completion submission components already used in the Pending Completions and Pending Maps pages. Implement pagination too, since the response from the API will be paginated. Obviously, they will be in a read-only version and will be lacking the ability to delete and manage the submissions.

## API Response

You will have to call the `GET /users/@me/submissions?page=...&type=map|completion&status=all` endpoint. The endpoint will return the following response type:

```typescript
interface MapSubmission {
  /** The code of the submitted map. */
  code: string;
  submitter: string;
  /** Additional notes provided in the submission. */
  subm_notes: string | null;
  format: number;
  /** The proposed difficulty */
  proposed_diff: number;
  /**
   * The proposed difficulty as a string. Nullable if it's a dynamic value
   * such as Nostalgia Pack remake maps.
   */
  proposed_diff_name: string | null;
  is_accepted: boolean;  // "false" doesn't mean it was rejected but "true" means it was accepted.
  rejected_by: string | null;
  /** The URL to an image of the map being completed */
  completion_proof: string;
  /** Date of the submission. */
  created_on: number;
}

interface ListCompletionWithMeta {
  /** The completion's unique ID */
  id: number;
  /** The code of the map that was completed */
  map: string | PartialMap;
  /** The players who completed this run. */
  users: PartialUser[];
  /** `true` if the run was black bordered. */
  black_border: boolean;
  /** `true` if the run did not use Geraldo. */
  no_geraldo: boolean;
  /** `true` if the run is the current LCC for the map. */
  current_lcc: boolean;
  lcc: {
    /**
     * The amount of cash saved at the end. Since Least Cash rules can't be
     * applied to custom maps, saveup is tracked instead of cash spent.
     */
    leftover: number;
  } | null;
  format: number;
  /** URL to the proof images used when submitting. */
  subm_proof_img: string[];
  /** URL to the proof videos used when submitting. */
  subm_proof_vid: string[];
  accepted_by: string | null;
  /**
   * Timestamp of the completion's creation date.
   * If `accepted_by`, it's when it was accepted. Otherwise, it's when it was submitted.
   */
  created_on: number | null;
  /**
   * Timestamp of the completion's deletion. Always `null` if not `accepted_by`.
   */
  deleted_on: number | null;
  /** Notes the user put when submitting. */
  subm_notes: string | null;
}

interface {
    pages: number
    total: number
    data: MapSubmission[] | ListCompletionWithMeta[]
}
```
