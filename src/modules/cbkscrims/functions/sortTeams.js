export default function sortTeams(botModule) {
  botModule.resources.teams.sort((a, b) => {
    return b.points - a.points;
  });
}