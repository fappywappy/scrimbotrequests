const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

module.exports = class Module {
  constructor(bot, dirname) {
    this.bot = bot;
    this.dirname = dirname;
    this.commands = {};
    this.settings = require(path.resolve(this.dirname, 'module.json'));
    
    this._loadEvents();
    this._loadCommands();
  }

  async _loadEvents() {
    const eventFiles = await readdir(path.resolve(this.dirname, 'events'));
    eventFiles.forEach(file => {
      const eventName = file.split(".")[0];
      const event = require(path.resolve(this.dirname, 'events', file)).default;
      this.bot.on(eventName, event.bind(null, this.bot, this));
    });
  }

  async _loadCommands() {
    const groupFolders = await readdir(path.resolve(this.dirname, 'commands'));

    for (let group of groupFolders) {
      const isDirectory = (await stat(path.resolve(this.dirname, 'commands', group))).isDirectory();

      if (isDirectory) {
        const commandFiles = await readdir(path.resolve(this.dirname, 'commands', group));
        const jsRegex = /^\w+(?=.(js|mjs|jsx|ts|tsx)$)/;

        for (let file of commandFiles) {
          const isFile =  (await stat(path.resolve(this.dirname, 'commands', group, file))).isFile();
          const isJavascript = jsRegex.test(file);
          
          if (isFile && isJavascript) {
            const pathToFile = path.resolve(this.dirname, 'commands', group, file);
            const commandName = file.split(".")[0];

            try {
              this.commands[commandName] = require(pathToFile).default.bind(null, this.bot, this);
            } catch (e) {
              console.log(`Unable to load '${pathToFile}'`);
              console.log(e);
            }

          }
        }
      }
    }
  }
}
