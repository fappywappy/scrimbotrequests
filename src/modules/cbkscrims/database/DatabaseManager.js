import mongoose from 'mongoose';
const { InfoModel } = require('./models');

export default class DatabaseManager {
  constructor() {
    this.init();
  }
  
  async init(bot) {
    // Connect to the database server.
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

    // Load database values.
    this.info = await require('./database/initDatabase')();

    this.initDefaultTeams(bot);
  }

  /**
   * Initiate teams if does not equal 30.
   */
  initDefaultTeams(bot) {
    if (bot.db.teams.length <= 30) {
      for (let i = bot.db.teams.length - 1; i < 30; i++) {
        bot.db.teams.push({
          name: `${i + 1}`,
          players: [],
        })
      }

      bot.saveDB();
    }
  }

  initDatabase (bot) {
    return await InfoModel.findOneAndUpdate({}, {}, { upsert: true, setDefaultsOnInsert: true, new: true, useFindAndModify: false }, async (err, result) => {
      if (err) console.log(err);
      return await result;
    });
  }

  saveDB() {
    const query = {};
    const updateObj = this.info;
    const options = { upsert: true, setDefaultsOnInsert: true, new: true, useFindAndModify: false };
    const errHandler = (err) => { if (err) console.log(err) };
  
    InfoModel.findOneAndUpdate(query, updateObj, options, errHandler);
  }
}
