const { bot } = require("../main");
const Users = require("../../model/user");
const Categories = require("../../model/category");
const Products = require("../../model/product");

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
            callback_data: page > 1 ? "back_category" : page,
          },
          {
            text: page,
            callback_data: "0",
          },
          {
            text: "Keyingi kategory",
            callback_data: limit == categories.length ? "next_category" : page,
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
  if (action === "next_category") {
    page++;
  }
  await Users.findByIdAndUpdate(
    user._id,
    { ...user, action: `category-${page}` },
    { new: true }
  );
  get_all_categories(chatId, page);
};

const show_category = async (chatId, id, page = 1) => {
  const category = await Categories.findById(id);
  const user = await Users.findOne({ chatId });
  await Products.findByIdAndUpdate(user._id, {...user, action: `category_${category._id}`}, {new: true})
  let limit = 5;
  let skip = (page - 1) * 5;
  const product = await Products.find({ category: category._id })
    .skip(skip)
    .limit(limit);
  const productList = product.map((product) => [
    {
      text: product.title,
      callback_data: `product_${product._id}`,
    },
  ]);

  let userKeyboard = [];
  let adminKeyboard = [
    [
      {
        text: "Yangi mahsulot",
        callback_data: "add_product",
      },
    ],
    [
      {
        text: "Tahrirlash",
        callback_data: `edit_category-${category._id}`,
      },
      {
        text: "O'chirish",
        callback_data: `del_category-${category._id}`,
      },
    ],
  ];

  const keyboards = user.admin ? adminKeyboard : userKeyboard;

  bot.sendMessage(chatId, `${category.title} ro'yxati`, {
    reply_markup: {
      remove_keyboard: true,
      inline_keyboard: [
        ...productList,
        [
          {
            text: "Orqaga",
            callback_data: page > 1 ? "back_product" : page,
          },
          {
            text: page,
            callback_data: "0",
          },
          {
            text: "Keyingi",
            callback_data: limit == product.length ? "next_product" : page,
          },
        ],
        ...keyboards,
      ],
    },
  });
};

const delete_category = async (chatId, id) => {
  const user = await Users.findOne({ chatId });
  const category = await Categories.findById(id);

  if (user.action !== "del_category") {
    await Users.findByIdAndUpdate(
      user._id,
      { ...user, action: "del_category" },
      { new: true }
    );
    bot.sendMessage(
      chatId,
      `Siz ${category.title}ni o'chirmoqchisiz. Ishonchingiz komilmi?`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Bekor qilish",
                callback_data: `category_${category._id}`
              },
              {
                text: "O'chirish",
                callback_data: `del_category-${category._id}`
              }
            ]
          ]
        },
      }
    );
  }else{
    let products = await Products.find({category: category._id}).select(["_id"])
    await Promise.all(products.map(async (product) => {
      await Products.findByIdAndRemove(product._id)
    }))

    await Products.findByIdAndRemove(id)

    bot.sendMessage(chatId, `${category.title} turkum o'chirildi. Menudan tanlang`)

  }
};

module.exports = {
  get_all_categories,
  add_category,
  new_category,
  pagination_category,
  show_category,
  delete_category
};
