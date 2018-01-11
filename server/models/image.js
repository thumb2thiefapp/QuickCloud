var mongoose = require('mongoose');

var ImageSchema = new mongoose.Schema({
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

ImageSchema.statics.findByEmail = function (email) {
  var ImagePath = this;

  return ImagePath.findOne({email}).then((imagePath) => {
    if (!imagePath) {
      return Promise.reject();
    }
    return imagePath;
  });
};


var ImagePath = mongoose.model('ImagePath',ImageSchema);

module.exports = ImagePath;
