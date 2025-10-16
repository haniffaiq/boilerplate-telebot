import 'dotenv/config';
const required = (k) => {
  const v = process.env[k];
  if (!v) throw new Error(`Missing ENV ${k}`);
  return v;
};
export const ENV = {
  PORT: parseInt(process.env.PORT || '8080', 10),
  BOT_TOKEN: required('BOT_TOKEN'),
  API_KEY: required('API_KEY'),
  PUBLIC_URL: process.env.PUBLIC_URL || '', // optional
};
