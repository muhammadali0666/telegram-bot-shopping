const { bot } = require("../main");
const Users = require("../../model/user");
const Categories = require("../../model/category");

const get_all_categories = async (msg) => {
  const chatId = msg.from.id;
  const user = await Users.findOne({ chatId });
  const categories = await Categories.find();

  bot.sendMessage(chatId, "Kategorilar ro'yxati", {
    reply_markup: {
      remove_keyboard: true,
      inline_keyboard: [
        [
          {
            text: "Orqaga",
            callback_data: "back_category",
          },
          {
            text: "1",
            callback_data: "0",
          },
          {
            text: "Keyingi kategory",
            callback_data: "next_data",
          },
        ],
        user.admin
          ? [
              {
                text: "Yangi kategory",
                callback_data: "add_category",
              },
            ]
          : [],
      ],
    },
  });
};

const add_category = async (chatId) => {
  const user = await Users.findOne({ chatId });

  if (user.admin) {
    await Users.findByIdAndUpdate(
      user._id,
      { ...user, action: "add_category" },
      { new: true }
    );
    bot.sendMessage(chatId, "Yangi kategory nimini kriting")
  }else{
    bot.sendMessage(chatId, "Sizga bunday ruxsat mavjud emas")
  }
};

module.exports = {
  get_all_categories,
  add_category
};
