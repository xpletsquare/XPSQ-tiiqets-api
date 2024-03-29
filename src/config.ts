// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

export const CONFIG = {
  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017/uzu-tickets",
  MONGO_PASSWORD: process.env.MONGO_PASSWORD || "",
  JWT_SECRET: process.env.JWT_SECRET || "tiq-secret-secret",
  SUPER_ADMIN_EMAIL:
    process.env.SUPER_ADMIN_EMAIL || "testsuperadmin@gmail.com",
  SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD || "@password123",
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 3200,
  NODE_ENV: process.env.NODE_ENV || "development",
  REDIS_URL: process.env.REDIS_URL || "",

  paystackSecret: process.env.PAYSTACK_SECRET_KEY,
  paystackPublic: process.env.PAYSTACK_PUBLIC_KEY,
  paystackCallBackUrl: process.env.PAYSTACK_CALLBACK_URL,
  paystackURL: process.env.PAYSTACK_URL,

  mailgun: {
    apikey: process.env.MAILGUN_APIKEY,
    domain: process.env.MAILGUN_DOMAIN,
    host: process.env.MAILGUN_HOST,
  },
};
