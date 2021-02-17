const { Sequelize } = require("sequelize");
const Umzug = require("umzug");
const path = require("path");

const connect = async () => {
  try {
    const sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        logging: false,
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT,
        dialect: "postgres",
      }
    );
    await sequelize.authenticate();
    console.info(`Connected to database`);
    return sequelize;
  } catch (error) {
    console.error("Error connecting to database");
    throw error;
  }
};

const migrate = async (sequelize) => {
  try {
    const umzug = new Umzug({
      migrations: {
        // indicates the folder containing the migration .js files
        path: path.join(__dirname, "./migrations"),
        // inject sequelize's QueryInterface in the migrations
        params: [sequelize.getQueryInterface()],
      },
      // indicates that the migration data should be store in the database
      // itself through sequelize. The default configuration creates a table
      // named `SequelizeMeta`.
      storage: "sequelize",
      storageOptions: {
        sequelize: sequelize,
      },
    });

    await umzug.up();
  } catch (error) {
    console.error("Error migrating database");
    throw error;
  }
};

module.exports = { connect, migrate };
