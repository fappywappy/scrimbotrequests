const saveResources = require('../database/saveResources');

module.exports = async function (bot) {
  bot.teams[i].sort((a, b) => {
    return b.points - a.points;
  });
}