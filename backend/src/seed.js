const uuid = require('uuid');
const _ = require('lodash');
const { encryptPassword } = require('./_utils');

const wordfactoryExport = require('../wordfactory-export.json');

module.exports = async (db) => {
  await db.Teacher.create({
    id: uuid.v4(),
    name: 'superuser',
    password_encrypted: await encryptPassword('superuser'),
    email: 'super@user.nl',
  });
};
