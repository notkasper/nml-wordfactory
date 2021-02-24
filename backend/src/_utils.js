const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      }
      resolve(decoded);
    });
  });

module.exports = { encryptPassword, checkPassword, generateToken, verifyToken };
