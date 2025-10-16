import fetch from "node-fetch";
import FormData from "form-data";
import { ENV } from "../utils/env.js";
import { HttpError } from "../utils/httpError.js";

const base = `https://api.telegram.org/bot${ENV.BOT_TOKEN}`;

export async function sendMessage({ chat_id, text, parse_mode, disable_notification }) {
  const res = await fetch(`${base}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id, text, parse_mode, disable_notification: !!disable_notification })
  });
  const data = await res.json();
  if (!data.ok) throw new HttpError(502, "telegram_error", data);
  return data.result;
}

export async function sendimage({ chat_id, image, caption, parse_mode, disable_notification }) {
  const form = new FormData();
  const clean = image.replace(/^data:image\/\w+;base64,/, "");
  const buf = Buffer.from(clean, "base64");

  form.append("chat_id", String(chat_id));
  form.append("photo", buf, { filename: "image.jpg" });
  if (caption) form.append("caption", caption);
  if (parse_mode) form.append("parse_mode", parse_mode);
  if (disable_notification) form.append("disable_notification", "true");

  const res = await fetch(`${base}/sendPhoto`, { method: "POST", body: form });
  const data = await res.json();
  if (!data.ok) throw new HttpError(502, "telegram_error", data);
  return data.result;
}
