const { RichEmbed } = require('discord.js');
const stripIndent = require('strip-indent');

const errorMsg = require('../utils/errorMsg.js');
const clearRequests = require('../utils/clearRequests.js');
const orderByPoints = require('../utils/orderByPoints.js');

module.exports = async function (bot, args, msg) {
  const { INTEAM_ROLE, COMMAND_PREFIX, TEAM_CHANNEL } = bot.config;

  if (!bot.inScrim) {
    return errorMsg(msg, `There must be a scrim active to use this command. ${COMMAND_PREFIX}scrimend or ${COMMAND_PREFIX}scrimreset to end the scrim.`);
  };

  if (!args.length) {
    return errorMsg(msg, 'Please provide the scrim name.');
  };

  const override = args[1];
  console.log(override);
  if (!bot.resultsRecorded || !override) {
    return errorMsg(msg, `Placement and kill results for all three games must be recorded.`);
  }

  const scrimName = args[0];

  orderByPoints(bot);
  const winningTeams = bot.resources.teams.slice(0, 5).filter(teams => teams.points !== 0);

  if (!winningTeams.length) {
    return errorMsg(msg, `No teams have any points.`);
  }

  let congratsStr;

  if (slots.length === 1) {
    congratsStr = `Congratulations to the ${winningTeams.length} winning team!`;
  } else {
    congratsStr = `Congratulations to the ${winningTeams.length} winning teams!`;
  }

  const embed = new RichEmbed();
  embed.setColor(0x36393E);
  embed.setAuthor(`${scrimName} has ended!`, 'https://cdn3.iconfinder.com/data/icons/award-gray-set-1/100/award-13-512.png')
  embed.setDescription(congratsStr);

  for (let i = 0; i < 15; i++) {
    const team = bot.resources.teams[i];

    if (team.points) {
      embed.addField(`◄  Rank #${i + 1} | ${team.name}  ►`, stripIndent(`
      __**Statistics**__
      Game 1: #${team.name}
      Game 2: #${team.game1position}
      Game 3: #${team.game2position}
      Kills: ${team.game1kills + team.game2kills + team.game3kills}
      Points: ${team.game2kills}

      __**Players**__
      ${team.players.reduce((str, p, idx) => {
        return str + `<@${p}>${idx < players.length - 1 ? '\n' : ''}`
      }, '') || 'None'}
    `));
    }
  }

  msg.channel.send(embed);
  msg.channel.send(`<@&${INTEAM_ROLE}>`).then(m => m.delete(1000));
  msg.delete(500);

  //everyother team cleared out

  bot.resources.teams = bot.resources.teams.map((team) => {
    return {
      name: team.name,
      players: team.players,
      points: 0,
      game1position: 0,
      game2position: 0,
      game3position: 0,
      game1kills: 0,
      game2kills: 0,
      game3kills: 0,
    }
  })

  bot.isLocked = false;
  bot.inScrim = false;
  bot.game1positions = false;
  bot.game2positions = false;
  bot.game3positions = false;
  bot.game1kills = false;
  bot.game2kills = false;
  bot.game3kills = false;
  bot.resultsRecorded = false;

  // Clear all but top five.
  const { teams } = bot.resources;
  const { INTEAM_ROLE } = bot.config;

  const toRemoveUsers = [];
  for (let i = 5; i < teams.length; i++) {
    let team = teams[i];

    team.players.forEach((userID) => {
      toRemoveUsers.push(userID);
    });

    bot.resources.teams[i].players = [];
  }

  const role = bot.guild.roles.get(INTEAM_ROLE);
  const toRemoveMembers = role.members.filter((member) => {
    return toRemoveUsers.some(userID => member.id === userID);
  });

  toRemoveMembers.tap(member => member.removeRole(role));

  bot.saveResources(bot);
  bot.updateTeams(bot);
}