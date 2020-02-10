import { Module } from 'dismodular';

export default class Base extends Module {
  constructor(bot) {
    super(bot, __dirname);
    if (!this.settings.active) return;
  }
}