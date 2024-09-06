const { bot } = require("../main");
const Users = require("../../model/user");
const { userKeyboard } = require("../menu/keyboard");

const get_all_user = async (msg) => {
  const chatId = msg.from.id;

  const user = await Users.findOne({ chatId });

  if (user.admin) {
    const users = await Users.find();
    bot.sendMessage(
      chatId,
      `foydalanuvchilar ro'yxati:\n ${users.map(
        (item) => `${item.name}: ${item.createdAt.toLocaleString()}\n`
      )}`
    );
  } else {
    bot.sendMessage(
      chatId,
      `Siz foydalanuvchilar ro'yxatini olishingiz mumkinmas`,
      {
        reply_markup: {
          keyboard: userKeyboard,
          resize_keyboard: true,
        },
      }
    );
  }
};

module.exports = {
  get_all_user,
};
