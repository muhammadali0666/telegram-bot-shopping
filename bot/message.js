const { bot } = require("./main");
const { start, requestContact } = require("./helper/start");
const Users = require("../model/user");
const { get_all_user } = require("./helper/user");
const { get_all_categories, new_category } = require("./helper/category");

bot.on("message", async (msg) => {
  const chatId = msg.from.id;
  const text = msg.text;

  const foundUser = await Users.findOne({ chatId });

  if (text === "/start") {
    start(msg);
  }

  if (foundUser) {
    if (foundUser.action === "request_contact" && !foundUser.phone) {
      requestContact(msg);
    }
    if (text === "Foydalanuvchilar") {
      get_all_user(msg);
    }
    if (text === "Category") {
      get_all_categories(chatId);
    }
  }
  if (foundUser.action === "add_category") {
    new_category(msg);
  }
});
