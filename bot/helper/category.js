const { bot } = require("../main");
const Users = require("../../model/user");
const Categories = require("../../model/category");
const { adminKeyboard, userKeyboard } = require("../menu/keyboard");

const get_all_categories = async (msg) => {
  const chatId = msg.from.id
  const user = await Users.find({chatId})
  const categories = await Categories.find()

  bot.sendMessage(chatId, "Kategorilar ro'yxati", {
    reply_markup: {
      remove_keyboard: true,
      inline_keyboard: [
        [
          {
            text: "Orqaga",
            callback_data: "back_category"
          },
          {
            text: "1",
            callback_data: "0"
          },
          {
            text: "Keyingi kategory",
            callback_data: "next_data"
          }
        ],
        [
          {
            text: "Yangi kategory",
            callback_data: "add_data"
          }
        ]
      ]
    }
  })
}

module.exports = {
  get_all_categories
}