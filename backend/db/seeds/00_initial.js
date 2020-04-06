const crypto = require('crypto');
const bcrypt = require('bcrypt');
const Knex = require('knex');

const tableNames = require('../../src/constants/tableNames');
const orderedTableNames = require('../../src/constants/orderedTableNames');
const countries = require('../../src/constants/countries');

/**
 * @param {Knex} knex
 */

exports.seed = async (knex) => {
  await orderedTableNames
    .reduce(async (promise, table_name) => {
      await promise;
      console.log('Clearing', table_name);
      return knex(table_name).del();
    }, Promise.resolve());

  const password = crypto.randomBytes(15).toString('hex');

  const user = {
    email: 'racftw@gmail.com',
    name: 'RC',
    password: await bcrypt.hash(password, 12),
  };


  const [createdUser] = await knex(tableNames.user)
    .insert(user)
    .returning('*');

  console.log('User created:', {
    password,
  }, createdUser);

  await knex(tableNames.country)
    .insert(countries);

  await knex(tableNames.county)
    .insert([{
      name: 'HERTS',
    }]);
};
