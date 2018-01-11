const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
}, { usePushEach: true });

AdminSchema.methods.toJSON = function () {
  var admin = this;
  var adminObject = admin.toObject();

  return _.pick(adminObject, ['_id', 'username']);
};

AdminSchema.methods.generateAuthToken = function () {
  var admin = this;
  var access = 'auth';
  var token = jwt.sign({_id: admin._id.toHexString(), access}, 'abc123').toString();

  admin.tokens.push({access, token});

  return admin.save().then(() => {
    return token;
  });
};

AdminSchema.statics.findByToken = function (token) {
  var Admin = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    return Promise.reject();
  }

  return Admin.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

AdminSchema.methods.removeToken = function (token) {
  var admin = this;

  return admin.update({
    $pull: {
      tokens: {token}
    }
  });
};

AdminSchema.statics.findByCredentials = function (adminname, password) {
  var admin = this;

  return admin.findOne({adminname}).then((admin) => {
    if (!admin) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and admin.password
      bcrypt.compare(password, admin.password, (err, res) => {
        if (res) {
          resolve(admin);
        } else {
          reject();
        }
      });
    });
  });
};

AdminSchema.pre('save', function (next) {
  var admin = this;

  if (admin.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(admin.password, salt, (err, hash) => {
        admin.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var Admin = mongoose.model('Admin',AdminSchema);

module.exports = Admin;
