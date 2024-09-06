const { bot } = require("../main");
const Users = require("../../model/user");
const Categories = require("../../model/category");

const get_all_categories = async (msg) => {
  const chatId = msg.from.id;
  const user = await Users.findOne({ chatId });

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
  let user = await Users.findOne({ chatId });

  user.action = "add_category";

  if (user.admin) {
   await Users.findByIdAndUpdate(
      user._id,
      user,
      { new: true }
    );
    bot.sendMessage(chatId, "Yangi kategory nomini kriting");
  } else {
    bot.sendMessage(chatId, "Sizga bunday ruxsat mavjud emas");
  }
};

const new_category = async (msg) => {
  const chatId = msg.from.id;
  const text = msg.text;
  const user = await Users.findOne({ chatId });

  if (user.admin && user.action === "add_category") {
    let newCategory = new Categories({
      title: text,
    });
    await newCategory.save();
    await Users.findByIdAndUpdate(user._id, { ...user, action: "category" });
    get_all_categories(msg);
  } else {
    bot.sendMessage(chatId, "Sizga bunday ruxsat mavjud emas");
  }
};

module.exports = {
  get_all_categories,
  add_category,
  new_category,
};
