const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const schema = new Schema({
  p_type: String,
  v0: {
    type: String,
    index: true
  },
  v1: {
    type: String,
    index: true
  },
  v2: {
    type: String,
    index: true
  },
  v3: {
    type: String,
    index: true
  },
  v4: {
    type: String,
    index: true
  },
  v5: {
    type: String,
    index: true
  }
}, { collection: 'casbin_rule', minimize: false, timestamps: false });

module.exports = mongoose.model('CasbinRule', schema, 'casbin_rule');
