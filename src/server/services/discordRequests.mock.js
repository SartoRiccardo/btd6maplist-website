/**
 * Access codes follow the syntax: mock_discord_code_(user_id)_(perm_int)
 * Mock access tokens follow the syntax: mock_discord_(user_id)_(perm_int)
 * Refresh access tokens follow the syntax: mock_discord_refresh_(user_id)_(perm_int)
 *
 * Where perm_int is a parameter where each bit is a Maplist perm. For each bit:
 * 0 - Unauthorized (token is invalid)
 * 1 - Not in the Discord
 * 2 - Requires recording to submit any run
 * 3 - Banned from submitting
 * 4 - Maplist Moderator
 * 5 - Expert List Moderator
 * 6 - Administrator (deprecated, resolved to Maplist Moderator + Expert List Moderator)
 * 7 - Maplist Owner
 * 8 - Expert List Owner
 */

function getMockData(token) {
  const mockData = token.match(/^mock_discord(?:_code|_refresh)?_(\d+)_(\d+)$/);
  return mockData || [null, 1, 1];
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
