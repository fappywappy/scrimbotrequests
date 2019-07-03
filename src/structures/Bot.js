import Discord from 'discord.js';
import { promisify } from 'util';
import path from 'path';
const readdir = promisify(require('fs').readdir);

export default class Bot extends Discord.Client {
  constructor(dirname, config) {
    super();
    this.dirname = dirname;
    this.config = config;
    this.PROD = process.env.NODE_ENV !== 'development';
    this.login(this.PROD ? process.env.TOKEN : process.env.DEVTOKEN);
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
