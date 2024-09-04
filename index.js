const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoConnection = require("./db/config_db");
require("./bot/main")

const app = express();

const PORT = process.env.PORT || 4000;
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

mongoConnection();

app.listen(PORT, () => {
  console.log("Server is running on the port " + PORT);
});
