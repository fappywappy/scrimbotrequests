module.exports = async function (bot) {
  const { GUILD, TEAM_CHANNEL, REQUESTS_CHANNEL, LOG_CHANNEL } = bot.config;

  // Defining guild.
  bot.guild = bot.client.guilds.get(GUILD);

  const { channels } = bot.guild;

  // Defining channels.
  bot.teamChannel = channels.get(TEAM_CHANNEL);
  bot.requestsChannel = channels.get(REQUESTS_CHANNEL);
  bot.logChannel = channels.get(LOG_CHANNEL);
}