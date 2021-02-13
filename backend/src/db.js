const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.info(`Connected to database: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("Error connecting to database:");
    console.error(error);
  }
};

module.exports = connectDb;
