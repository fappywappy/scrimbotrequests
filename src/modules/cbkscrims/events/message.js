import { Command } from 'dismodular';

export default function message(bot, module, msg) {
  // Returns if the sender is a bot, message is not from a text channel,
  // or if sender has insufficient permissions.
  if (msg.author.bot) return;
  if (!Command.isCommand(bot, msg)) return;

  // Separate the message content into commands and arguments.
  const [command, args] = Command.parseCommand(bot, msg);

  // Matches the command to its file in './commands'.
  if (command in module.commands) {
    module.commands[command](args, msg);
  }
}