var mongoose = require('mongoose');

var MusicSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  paths:[{
     path:{
      type: String,
      required: true
    }
  }]
});

MusicSchema.statics.findByEmail = function (email) {
  var MusicPath = this;

  return MusicPath.findOne({email}).then((musicPath) => {
    if (!musicPath) {
      return Promise.reject();
    }
    return musicPath;
  });
};


var MusicPath = mongoose.model('MusicPath',MusicSchema);

module.exports = MusicPath;
