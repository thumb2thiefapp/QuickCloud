var mongoose = require('mongoose');

var VideoSchema = new mongoose.Schema({
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

VideoSchema.statics.findByEmail = function (email) {
  var VideoPath = this;

  return VideoPath.findOne({email}).then((videoPath) => {
    if (!videoPath) {
      return Promise.reject();
    }
    return videoPath;
  });
};


var VideoPath = mongoose.model('VideoPath',VideoSchema);

module.exports = VideoPath;
