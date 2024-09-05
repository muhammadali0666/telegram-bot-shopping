const { bot } = require("./main");
const Users = require("../model/user");

bot.on("callback_query", async (query) => {
  console.log(query);
  
});
