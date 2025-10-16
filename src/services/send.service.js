import { sendMessage, sendimage } from "../libs/telegram.js";

export async function sendUnified(payload) {
  const { chat_id, message, image, parse_mode, disable_notification } = payload;

  if (image) {
    const result = await sendimage({
      chat_id,
      image,
      caption: message,
      parse_mode,
      disable_notification
    });
    return { kind: "photo", result };
  }

  const result = await sendMessage({
    chat_id,
    text: message,
    parse_mode,
    disable_notification
  });
  return { kind: "text", result };
}
