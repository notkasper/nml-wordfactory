const { Sequelize } = require('sequelize');
const Umzug = require('umzug');
const path = require('path');

const connect = async () => {
  const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT,
    dialect: 'postgres',
  });
  await sequelize.authenticate();
  console.info(`Connected to database`);
  return sequelize;
};

const migrate = async (sequelize) => {
  const umzug = new Umzug({
    migrations: {
      // indicates the folder containing the migration .js files
      path: path.join(__dirname, './migrations'),
      // inject sequelize's QueryInterface in the migrations
      params: [sequelize.getQueryInterface()],
    },
    // indicates that the migration data should be store in the database
    // itself through sequelize. The default configuration creates a table
    // named `SequelizeMeta`.
    storage: 'sequelize',
    storageOptions: {
      sequelize: sequelize,
    },
  });

  await umzug.up();
};

const prepare = async () => {
  try {
    const sequelize = await connect();
    await migrate(sequelize);
  } catch (error) {
    console.error('Error preparing database:');
    console.error(error);
    throw error; // If database does not connect, the server should shut down
  }
};

module.exports = { prepare };
