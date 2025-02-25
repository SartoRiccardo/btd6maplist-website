import * as discord from "./services/discordRequests.server";
import * as discordMock from "./services/discordRequests.mock";

export async function getAccessToken(code) {
  return process.env.MOCK_DISCORD
    ? discordMock.getAccessToken(code)
    : discord.getAccessToken(code);
}

export async function refreshAccessToken(refresh_token) {
  return process.env.MOCK_DISCORD
    ? discordMock.refreshAccessToken(refresh_token)
    : discord.refreshAccessToken(refresh_token);
}

export async function revokeAccessToken(accessToken) {
  return process.env.MOCK_DISCORD
    ? discordMock.revokeAccessToken(accessToken)
    : discord.revokeAccessToken(accessToken);
}

export async function getDiscordUserGuilds(accessToken) {
  return process.env.MOCK_DISCORD
    ? discordMock.getDiscordUserGuilds(accessToken)
    : discord.getDiscordUserGuilds(accessToken);
}
