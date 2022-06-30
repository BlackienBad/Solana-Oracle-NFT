import process from 'node:process';
process.env.NTBA_FIX_319 = "1";

require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(process.env.TOKEN);
const CHAT_ID = null;

export const logError = (name, e) => {
  bot.sendMessage(CHAT_ID, `${name}: ${e}`);
};
