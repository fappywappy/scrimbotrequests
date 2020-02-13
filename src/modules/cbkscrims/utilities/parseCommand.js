export default function parseCommand(botModule, msg) {
  const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const prefixRegex = new RegExp(`^(<@!?${botModule.bot.user.id}>|${escapeRegex(botModule.config.prefix)})\\s*`);
  if (!prefixRegex.test(msg.content)) return;

  const [, matchedPrefix] = msg.content.match(prefixRegex);
  const rawArgs = msg.content.slice(matchedPrefix.length).trim().split(/ +/);
  const command = rawArgs.shift().toLowerCase();

  const args = (rawArgs.length ?
    rawArgs.join(' ').split(/[,]+/).map(e => e.trim()) :
    rawArgs
  );

  return [command, args];
};