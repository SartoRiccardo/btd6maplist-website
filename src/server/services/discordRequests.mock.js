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
 * 5 - Expert Moderator
 * 6 - Administrator
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

export async function isInMaplist(accessToken) {
  const mockData = getMockData(accessToken);
  return !(parseInt(mockData[2]) & 3);
}

export async function getDiscordUser(accessToken) {
  const mockData = getMockData(accessToken);
  if (parseInt(mockData[2]) & 1) return null;
  return {
    id: mockData[1],
    username: `usr${mockData[1]}`,
    avatar: "31eb929ef84cce316fa9be34fc9b1c5b",
    global_name: `Test User ${mockData[1]}`,
    // And other fields...
  };
}

export async function getMaplistRoles(accessToken) {
  const mockData = getMockData(accessToken);
  if (parseInt(mockData[2]) & 3) return null;

  const roles = [];
  if (mockData[2] & 4) roles.push(process.env.NEXT_PUBLIC_NEEDSREC_ROLES);
  if (mockData[2] & 16) roles.push(process.env.NEXT_PUBLIC_LISTMOD_ROLE);
  if (mockData[2] & 32) roles.push(process.env.NEXT_PUBLIC_EXPMOD_ROLE);
  if (mockData[2] & 64)
    roles.push(process.env.NEXT_PUBLIC_ADMIN_ROLES.split(",")[0]);
  return roles;
}
