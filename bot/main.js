const telegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const botToken = process.env.BOTTOKEN;
const bot = new telegramBot(botToken, { polling: true });

module.exports = {
  bot,
};

require("./message")
require("./query")
