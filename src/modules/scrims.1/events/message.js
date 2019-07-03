import loadCommands from './ready/functions/loadCommands';

export default function message(bot, msg) {
  // Returns if the sender is a bot, message is not from a text channel,
  // or if sender has insufficient permissions.
  if (msg.author.bot) return;
  if (!isCommand(bot, msg)) return;

  // Separate the message content into commands and arguments.
  const [command, args] = parseCommand(bot, msg);

  // Matches the command to its file in './commands'.
  if (command in bot.COMMANDS) {
    bot.COMMANDS[command](bot, args, msg);
  }
}