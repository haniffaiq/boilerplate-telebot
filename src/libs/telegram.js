import fetch from "node-fetch";
import FormData from "form-data";
import { ENV } from "../utils/env.js";
import { HttpError } from "../utils/httpError.js";

let tokenIndex = 0;
const tokenInfoCache = new Map();
const baseUrl = (token) => `https://api.telegram.org/bot${token}`;

const callApiJson = async (token, method, body) => {
  const res = await fetch(`${baseUrl(token)}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body || {})
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.description || "telegram_api_error");
  return data.result;
};

const getBotInfo = async (token) => {
  if (tokenInfoCache.has(token)) return tokenInfoCache.get(token);
  const info = await callApiJson(token, "getMe");
  tokenInfoCache.set(token, info);
  return info;
};

const isActiveMember = (member) => {
  if (!member) return false;
  if (member.status === "left" || member.status === "kicked") return false;
  if (member.status === "restricted" && member.can_send_messages === false) return false;
  return true;
};

const pickTokenForChat = async (chat_id) => {
  const { BOT_TOKENS } = ENV;
  if (!BOT_TOKENS || BOT_TOKENS.length === 0) {
    throw new Error("No bot token configured");
  }

  const total = BOT_TOKENS.length;
  for (let i = 0; i < total; i += 1) {
    const token = BOT_TOKENS[tokenIndex % total];
    tokenIndex = (tokenIndex + 1) % total;
    try {
      const info = await getBotInfo(token);
      const member = await callApiJson(token, "getChatMember", {
        chat_id,
        user_id: info.id
      });
      if (isActiveMember(member)) return token;
    } catch {
      continue;
    }
  }

  throw new Error("no_active_bot_in_chat");
};

export async function sendMessage({ chat_id, text, parse_mode, disable_notification }) {
  const token = await pickTokenForChat(chat_id);
  const res = await fetch(`${baseUrl(token)}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id, text, parse_mode, disable_notification: !!disable_notification })
  });
  const data = await res.json();
  if (!data.ok) throw new HttpError(502, "telegram_error", data);
  return data.result;
}

export async function sendimage({ chat_id, image, caption, parse_mode, disable_notification }) {
  const token = await pickTokenForChat(chat_id);
  const form = new FormData();
  const clean = image.replace(/^data:image\/\w+;base64,/, "");
  const buf = Buffer.from(clean, "base64");

  form.append("chat_id", String(chat_id));
  form.append("photo", buf, { filename: "image.jpg" });
  if (caption) form.append("caption", caption);
  if (parse_mode) form.append("parse_mode", parse_mode);
  if (disable_notification) form.append("disable_notification", "true");

  const res = await fetch(`${baseUrl(token)}/sendPhoto`, { method: "POST", body: form });
  const data = await res.json();
  if (!data.ok) throw new HttpError(502, "telegram_error", data);
  return data.result;
}
