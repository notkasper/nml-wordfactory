const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const encryptPassword = (password) =>
  new Promise((resolve, reject) => {
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        reject(err);
      }
      resolve(hash);
    });
  });

const checkPassword = (password, hash) =>
  new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });

const generateToken = (content) => {
  return jwt.sign(content, process.env.JWT_SECRET);
};

module.exports = { encryptPassword, checkPassword, generateToken };
