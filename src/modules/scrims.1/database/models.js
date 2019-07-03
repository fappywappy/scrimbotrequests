const mongoose = require('mongoose');

const defaultString = { type: String, default: '' };
const defaultStringArray = { type: [String], default: [] };
const defaultNumber = { type: Number, default: null };

const teamsSchema = mongoose.Schema({
  name: defaultString,
  players: defaultStringArray,
  points: defaultNumber,
  game1position: defaultNumber,
  game2position: defaultNumber,
  game3position: defaultNumber,
  game1kills: defaultNumber,
  game2kills: defaultNumber,
  game3kills: defaultNumber,
});

const metaSchema = mongoose.Schema({
  team_panel_1: defaultString,
  team_panel_2: defaultString,
});

const scrimSchema = mongoose.Schema({
});

const infoSchema = mongoose.Schema({
  teams: [teamsSchema],
  meta: metaSchema,
  scrims: scrimSchema,
  requests: {
    type: {
      request: {
        created_at: Date,
        message_id: defaultString,
        slot_number: defaultString,
      }
    }, default: {}
  },
}, { minimize: false }); // Minimize set to false srevents deletion of empty objects.

export const InfoModel = mongoose.model('scrims-info', infoSchema);
