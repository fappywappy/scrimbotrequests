const mongoose = require('mongoose');

const teams = mongoose.Schema({
  name: { type: String, default: '' },
  players: { type: [String], default: [] },
  points: { type: Number, default: null },
  positions: { type: Number, default: null },
  game2position: { type: Number, default: null },
  game3position: { type: Number, default: null },
  game1kills: { type: Number, default: null },
  game2kills: { type: Number, default: null },
  game3kills: { type: Number, default: null },
});

const panels = mongoose.Schema({
  panel1: { type: String, default: '' },
  panel2: { type: String, default: '' },
});

const requests = mongoose.Schema({
  type: {
    request: {
      created_at: Date,
      message_id: defaultString,
      slot_number: defaultString,
    }
  }, default: {}
})

const infoSchema = mongoose.Schema({
  teams,
  panels,
  requests,
}, { minimize: false }); // Minimize set to false srevents deletion of empty objects.

export const InfoModel = mongoose.model('scrims-info', infoSchema);
