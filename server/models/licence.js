var mongoose = require('mongoose');

var Licence = mongoose.model('Licence', {
  email: {
    default:"empty",
    type: String,
    trim: true
  },
  key: {
    type: String,
    required: true,
    unique: true
  },
  active: {
    type: Boolean,
    default: false
  },
  ad: {
    type: String,
    default:"empty"
  },
  ed: {
    type: String,
    default:"empty"
  },
  year: {
    type: Number,
    default: 1
  }
});

module.exports = Licence;
