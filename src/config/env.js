import dotenv from "dotenv";

dotenv.config();

export default {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  EMAIL: process.env.EMAIL,
  EMAIL_TOKEN: process.env.EMAIL_TOKEN,
  URL: process.env.URL
};
