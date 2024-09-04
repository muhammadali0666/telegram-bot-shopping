const { bot } = require("./main");
const { start, requestContact } = require("./helper/start");
const Users = require("../model/user");

bot.on("message", async (msg) => {
  const chatId = msg.from.id;
  const text = msg.text;

  const foundUser = await Users.findOne({ chatId }).lean();

  if (text === "/start") {
    start(msg);
  }

  if (foundUser) {    
    if (foundUser.action === "request_contact" && !foundUser.phone) {
      requestContact(msg);
    }
  }
});
