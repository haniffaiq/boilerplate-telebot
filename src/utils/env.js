import 'dotenv/config';
const required = (k) => {
  const v = process.env[k];
  if (!v) throw new Error(`Missing ENV ${k}`);
  return v;
};

const parseTokens = (raw) =>
  raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

const rawTokens = process.env.BOT_TOKENS;
const botTokens = rawTokens ? parseTokens(rawTokens) : [];
const mainToken = process.env.BOT_TOKEN || botTokens[0];
if (!mainToken) throw new Error("Missing ENV BOT_TOKEN or BOT_TOKENS");
if (botTokens.length === 0) botTokens.push(mainToken);

export const ENV = {
  PORT: parseInt(process.env.PORT || '8080', 10),
  BOT_MAIN_TOKEN: mainToken,
  BOT_TOKENS: botTokens,
  API_KEY: required('API_KEY'),
  PUBLIC_URL: process.env.PUBLIC_URL || '', // optional
};
