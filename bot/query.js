const { bot } = require("./main");
const Users = require("../model/user");
const { add_category, pagination_category } = require("./helper/category");

bot.on("callback_query", async (query) => {
  const { data } = query;
  const chatId = query.from.id;

  if (data === "add_category") {
    add_category(chatId);
  }

  if (["next_category", "back_category"].includes(data)) {
    pagination_category(chatId, data);
  }
});
