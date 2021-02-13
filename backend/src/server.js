const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const expressRateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
dotenv.config({ path: "../.env" });

const test = require("./routes/test");
const connectDb = require("./db");

connectDb();

const app = express();

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Security headers
app.use(helmet());

// Xss prevention
app.use(xssClean());

// Sanitize data
app.use(mongoSanitize());

// Rate limiting
app.use(
  expressRateLimit({
    windowMs: 1000 * 60 * 5,
    max: 100,
  })
);

// Prevent http param pollution
app.use(hpp());

// CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, "./build")));

app.use("/api/v1/test", test);

app.use("/test", (req, res) => res.status(200).send({ data: "success" }));

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

process.on("unhandledRejection", (error, promise) => {
  console.log(`Error: ${error.message}`);
  server.close(() => {
    process.exit(1);
  });
});
