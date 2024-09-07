const { bot } = require("../main");
const Users = require("../../model/user");
const Categories = require("../../model/category");

const get_all_categories = async (chatId, page = 1) => {
  const user = await Users.findOne({ chatId });

  let limit = 5;
  let skip = (page - 1) * 5;

  if (page === 1) {
    await Users.findByIdAndUpdate(
      user._id,
      { ...user, action: "category-1" },
      { new: true }
    );
  }

  const categories = await Categories.find().skip(skip).limit(limit);

  const categoryList = categories.map((category) => [
    {
      text: category.title,
      callback_data: `category_${category._id}`,
    },
  ]);

  bot.sendMessage(chatId, "Kategorilar ro'yxati", {
    reply_markup: {
      remove_keyboard: true,
      inline_keyboard: [
        ...categoryList,
        [
          {
            text: "Orqaga",
            callback_data: "back_category",
          },
          {
            text: page,
            callback_data: "0",
          },
          {
            text: "Keyingi kategory",
            callback_data: "next_category",
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
    await Users.findByIdAndUpdate(user._id, user, { new: true });
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
    get_all_categories(chatId);
  } else {
    bot.sendMessage(chatId, "Sizga bunday ruxsat mavjud emas");
  }
};

const pagination_category = async (chatId, action) => {
  const user = await Users.findOne({ chatId });
  let page = 1;
  if (user.action.includes(`category-`)) {
    page += user.action.split("-")[1];
    if (action === "back_category" && page > 1) {
      page--;
    }
  }
  if(action === "next_category"){
    page ++
  }
  await Users.findByIdAndUpdate(user._id, {...user, action: `category-${page}`}, {new: true})
  get_all_categories(chatId, page)
};

module.exports = {
  get_all_categories,
  add_category,
  new_category,
  pagination_category,
};
