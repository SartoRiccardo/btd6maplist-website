/**
 * Access codes follow the syntax: mock_discord_code_(user_id)_(perm_list)
 * Mock access tokens follow the syntax: mock_discord_(user_id)_(perm_list)
 * Refresh access tokens follow the syntax: mock_discord_refresh_(user_id)_(perm_list)
 *
 * - perm_list is a plus-separated array of permissions.
 *   Permissions can be individual or by category.
 *   Individual: {permission}/{format_ids, comma separated. If empty, present in all formats}
 *     For example: edit:config/1,51+edit:map/1+edit:self/
 *   Category: !{category}/{format_ids, comma separated. If empty, present in all formats}
 *     For example: !mod/51+!curator/1,2
 *     Categories are methods in the Permissions class.
 *
 *   You can combine the two types: edit:config/+!mod/51
 */

function getMockData(token) {
  const mockData = token.match(/^mock_discord(?:_code|_refresh)?_(\d+)_(.*)$/);
  return mockData || [null, 1, ""];
}

export async function getAccessToken(code) {
  const mockData = getMockData(code);
  return {
    access_token: `mock_discord_${mockData[1]}_${mockData[2]}`,
    token_type: "Bearer",
    expires_in: 604800,
    refresh_token: `mock_discord_refresh_${mockData[1]}_${mockData[2]}`,
    scope: "identify",
  };
}

export async function refreshAccessToken(refresh_token) {
  const mockData = getMockData(refresh_token);
  return {
    access_token: `mock_discord_${mockData[1]}_${mockData[2]}`,
    token_type: "Bearer",
    expires_in: 604800,
    refresh_token,
    scope: "identify",
  };
}

export async function revokeAccessToken(accessToken) {
  return {};
}

export async function getDiscordUserGuilds(accessToken) {
  return [];
}
