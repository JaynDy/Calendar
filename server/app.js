require("dotenv").config();
const express = require("express");
const { PORT, DB_NAME } = require("./constants/constants");
const router = require("./routes/router");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { engine } = require("express-handlebars");
const cors = require("cors");
const { createDefaultCalendar } = require("./controller/calendars.controller");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine(
  "hbs",
  engine({
    defaultLayout: "main",
    extname: "hbs",
  }),
);
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(router);

async function init() {
  try {
    const mongoUri =
      process.env.MONGODB_URI || `mongodb://127.0.0.1:27017/${DB_NAME}`;
    await mongoose.connect(mongoUri);
    console.log(`[mongo] Connected to database success: ${DB_NAME}`);

    await createDefaultCalendar();

    app.listen(PORT, () => {
      console.log(`[express] Server started at http://localhost:${PORT}/`);
    });
  } catch (e) {
    console.log("[error] Cannot connect to database", e);
  }
}

init();
