import { hasPermission, parseCommand } from '../functions';

export default function message(mod, msg) {
  if (msg.author.bot) return;
  if (!hasPermission(mod, msg.author));
  const [command, args] = parseCommand(bot, msg);
  if (!command) return;

  if (command in mod.commands) {
    mod.commands[command](args, msg);
  }
}