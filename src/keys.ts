require('dotenv').config()

export const ENV_KEYS = {
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/tiqets',
  MONGO_PASSWORD: process.env.MONGO_PASSWORD || '',
  JWT_SECRET: process.env.JWT_SECRET || 'tiq-secret-secret',
  SUPER_ADMIN_EMAIL:
    process.env.SUPER_ADMIN_EMAIL || 'testsuperadmin@gmail.com',
  SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD || '@password123',
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  paystackSecret: process.env.PAYSTACK_SECRET_KEY,
  paystackPublic: process.env.PAYSTACK_PUBLICK_KEY,
  paystackCallBackUrl: process.env.PAYSTACK_CALLBACK_URL,
  paystackURL: process.env.PAYSTACK_URL,
};