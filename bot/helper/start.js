const { bot } = require("../main");
const Users = require("../../model/user");

const start = async (msg) => {
  const chatId = msg.from.id;

  const checkUser = await Users.find({ chatId }).lean();

  if (checkUser.length == 0) {
    const newUser = new Users({
      name: msg.from.first_name,
      chatId,
      admin: false,
      status: true,
      createdAt: new Date(),
      action: "request_contact",
    });

    await newUser.save();
    bot.sendMessage(
      chatId,
      `Assalomu alaykum hurmatli ${msg.from.first_name}. Iltimos telefon raqaminigizni ulashing`,
      {
        reply_markup: {
          keyboard: [
            [
              {
                text: "telefon raqamni yuborish",
                request_contact: true,
              },
            ],
          ],
          resize_keyboard: true,
        },
      }
    );
  }
};

const requestContact = async (msg) => {
  const chatId = msg.from.id;

  if (msg?.contact?.phone_number) {
    let user = await Users.findOne({ chatId }).lean();
    user.phone = msg.contact.phone_number;
    user.admin = msg.contact.phone_number == "+998904565025";
    user.action = "menu";

    await Users.findByIdAndUpdate(user._id, user, { new: true });
    bot.sendMessage(chatId, `Menuni tanlang, ${user.admin ? "Admin" : user.admin}`, {
      reply_markup: {
        keyboard: [
          [
            {
              text: "katalog",
            },
          ],
        ],
        resize_keyboard: true
      },
    });
  }
};

module.exports = {
  start,
  requestContact,
};
