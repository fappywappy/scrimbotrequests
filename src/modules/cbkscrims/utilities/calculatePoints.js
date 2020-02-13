export default function calculatePoints(botModule) {
  for (let i = 0; i < botModule.resources.teams.length; i++) {
    const team = botModule.resources.teams[i];
    let points = 0;
    points += botModule.config.PLACES[team.game1position];
    points += botModule.config.PLACES[team.game2position];
    points += botModule.config.PLACES[team.game3position];
    points += botModule.config.KILL_POINTS * team.game1kills;
    points += botModule.config.KILL_POINTS * team.game2kills;
    points += botModule.config.KILL_POINTS * team.game3kills;

    bot.resources.teams[i].points = points;
  }
}