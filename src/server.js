import { buildApp } from './app.js';
import { ENV } from './utils/env.js';
import { logger } from './utils/logger.js';
import { Telegraf } from 'telegraf';

// ==== START EXPRESS APP ====
const app = buildApp();
const server = app.listen(ENV.PORT, () =>
  logger.info({ port: ENV.PORT }, 'server_started')
);

// ==== START TELEGRAM BOT ====
const bot = new Telegraf(ENV.BOT_MAIN_TOKEN);

bot.start(async (ctx) => {
  const chat = ctx.chat;
  const id = chat.id;
  const type = chat.type;
  const name = chat.title || chat.username || `${chat.first_name || ''} ${chat.last_name || ''}`;

  await ctx.reply(
    `👋 Hai ${name}!\nType: ${type}\nChat ID: <code>${id}</code>`,
    { parse_mode: 'HTML' }
  );

  logger.info({ chat_id: id, type, name }, 'start_command');
});

bot.on('text', async (ctx) => {
  logger.info({
    chat_id: ctx.chat.id,
    from: ctx.from.username,
    text: ctx.message.text,
  }, 'incoming_message');
});

// Jalankan bot
bot.launch();
logger.info('telegram_bot_started');

// Graceful shutdown
process.once('SIGINT', () => {
  bot.stop('SIGINT');
  server.close(() => process.exit(0));
});
process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
  server.close(() => process.exit(0));
});
