const hasPermission = require('../../events/utils/hasPermission');
const errorMsg = require('../../utils/errorMsg.js');
const successMsg = require('../../utils/successMsg.js');
const logEvent = require('../../scrims/functions/logEvent');

const saveResources = require('../../database/saveResources');
const updateTeams = require('../../scrims/functions/updateTeams');

exports.run = async (client, message, [action, key, ...value], level) => { // eslint-disable-line no-unused-vars

  // Retrieve Default Values from the default settings in the bot.
  const defaults = client.settings.get("default");
  
  // Adding a new key adds it to every guild (it will be visible to all of them)
  if (action === "add") {
    if (!key) return message.reply("Please specify a key to add");
    if (defaults[key]) return message.reply("This key already exists in the default settings");
    if (value.length < 1) return message.reply("Please specify a value");

    // `value` being an array, we need to join it first.
    defaults[key] = value.join(" ");
  
    // One the settings is modified, we write it back to the collection
    client.settings.set("default", defaults);
    message.reply(`${key} successfully added with the value of ${value.join(" ")}`);
  } else
  
  // Changing the default value of a key only modified it for guilds that did not change it to another value.
  if (action === "edit") {
    if (!key) return message.reply("Please specify a key to edit");
    if (!defaults[key]) return message.reply("This key does not exist in the settings");
    if (value.length < 1) return message.reply("Please specify a new value");

    defaults[key] = value.join(" ");

    client.settings.set("default", defaults);
    message.reply(`${key} successfully edited to ${value.join(" ")}`);
  } else
  
  // WARNING: DELETING A KEY FROM THE DEFAULTS ALSO REMOVES IT FROM EVERY GUILD
  // MAKE SURE THAT KEY IS REALLY NO LONGER NEEDED!
  if (action === "del") {
    if (!key) return message.reply("Please specify a key to delete.");
    if (!defaults[key]) return message.reply("This key does not exist in the settings");
    
    // Throw the 'are you sure?' text at them.
    const response = await client.awaitReply(message, `Are you sure you want to permanently delete ${key} from all guilds? This **CANNOT** be undone.`);

    // If they respond with y or yes, continue.
    if (["y", "yes"].includes(response)) {

      // We delete the default `key` here.
      delete defaults[key];
      client.settings.set("default", defaults);
      
      // then we loop on all the guilds and remove this key if it exists.
      // "if it exists" is done with the filter (if the key is present and it's not the default config!)
      for (const [guildid, conf] of client.settings.filter((setting, id) => setting[key] && id !== "default")) {
        delete conf[key];
        client.settings.set(guildid, conf);
      }
      
      message.reply(`${key} was successfully deleted.`);
    } else
    // If they respond with n or no, we inform them that the action has been cancelled.
    if (["n","no","cancel"].includes(response)) {
      message.reply("Action cancelled.");
    }
  } else
  
  // Display a key's default value
  if (action === "get") {
    if (!key) return message.reply("Please specify a key to view");
    if (!defaults[key]) return message.reply("This key does not exist in the settings");
    message.reply(`The value of ${key} is currently ${defaults[key]}`);

  // Display all default settings.
  } else {
    await message.channel.send(`***__Bot Default Settings__***\n\`\`\`json\n${inspect(defaults)}\n\`\`\``);
  }
};

export const conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["defaults"],
  permLevel: "Bot Admin"
};

export const help = {
  name: "conf",
  category: "System",
  description: "Modify the default configuration for all guilds.",
  usage: "conf <view/get/edit> <key> <value>"
};

export default async function (bot, args, msg) {
  if (!hasPermission(bot, msg)) {
    return errorMsg(msg, `You don't have permission to run this command.`);
  };

  if (args.length < 2) {
    return errorMsg(msg, 'Please provide a slot number and a new team name.\n Make sure they are separated by commas.');
  };

  const curSlot = args[0];
  const newName = args[1];

  if (isNaN(curSlot) || curSlot <= 0 || curSlot >= 31) {
    return errorMsg(msg, `${curSlot} is not a valid number between 1 and 30.`);
  };

  const url = curSlot <= 15 ? bot.team_panel_1.url : bot.team_panel_2.url;

  const oldName = bot.resources.teams[curSlot-1].name;
  bot.resources.teams[curSlot-1].name = newName;
  successMsg(msg, `${oldName} has been successfully renamed as [${newName}](${url}).`);
  logEvent(bot, `${oldName} has been renamed as [${newName}](${url}).`);
  saveResources(bot);
  updateTeams(bot);
}