const Discord = require('discord.js');
const { promisify } = require('util');
const path = require('path');
const readdir = promisify(require('fs').readdir);

module.exports = class Bot extends Discord.Client {
  constructor(dirname, settings) {
    super();
    this.dirname = dirname;
    this.settings = settings;

    this.login((process.env.NODE_ENV !== 'development') ? process.env.TOKEN : process.env.DEV_TOKEN);
    
    this._loadModules();
  }

  async _loadModules() {
    const moduleFiles = await readdir(path.resolve(this.dirname, 'modules'));
    console.log(`Loading a total of ${moduleFiles.length} modules.`);
    
    moduleFiles.forEach(file => {
      const Module = require(path.resolve(this.dirname, 'modules', file)).default;
      const moduleName = file.split(".")[0];
      console.log(`Loaded: ${moduleName}`);
      new Module(this);
    });
  }
}
