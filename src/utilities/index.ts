/* eslint-disable @typescript-eslint/no-var-requires */

import { CONFIG } from "src/config";
import { customAlphabet } from 'nanoid'
import { IEventSchedule } from "src/interfaces";
const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNPQRSTUV', 10);
import { format, compareAsc } from 'date-fns';

const qrcodeReader = require('qrcode');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('graceful-fs');
const { v4: uuidv4 } = require('uuid');

export const hashPassword = (plainPassword: string) => {
  const hash = bcrypt.hashSync(plainPassword, 11);
  return hash;
};

export const createJWTWithPayload = (payload: any) => {
  const token = jwt.sign(payload, 'y(xQiYmM,Z}^cb>');
  payload.token = token;
  return payload;
};

export const verifyAndDecodeJWTToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, 'y(xQiYmM,Z}^cb>');
    return decoded;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

export const passwordMatches = (plainPassword: string, hash: string) => {
  const match = bcrypt.compareSync(plainPassword, hash);
  return match;
};

export const removeUnusedImage = async (imagePath = '') => {
  if (!imagePath) return;

  const fileExists = fs.existsSync(imagePath);
  if (!fileExists) return;

  await fs.promises.rm(imagePath);
  console.log('file deleted');
};


export const generateId = (): string => {
  return uuidv4();
};

export const cleanObject = (data: any) => {
  const copy = { ...data };

  Object.keys(data).forEach((key) => {
    const value = data[key];
    const isEmpty = [null, undefined, ''].includes(value);

    if (isEmpty) {
      delete copy[key];
    }
  });

  return copy;
};

export const isValidRating = (value: string | number) => {
  const parsed = Number(value + '');
  return [1, 2, 3, 4, 5].includes(parsed);
}

export const normalizeRating = (value: string | number) => {
  const ratingAsNumber = Number(value + '');
  return ratingAsNumber.toFixed(1);
}

export const generatePin = (numLength = 6) => {
  if (CONFIG.NODE_ENV === 'development') {
    return 123456;
  }

  let pin = '';

  for (let i = 0; i < numLength; i++) {
    pin += Math.random() * 10;
  }

  return parseInt(pin);
}

export const getQRCode = async (value): Promise<string> => {
  return new Promise((resolve) => {
    const valueAsString = JSON.stringify(value);

    qrcodeReader.toDataURL(valueAsString, (err: any, url: string) => {
      if (err) {
        console.log('QRCODE ERROR: ', err.message || err)
      }

      resolve(url || null)
    })
  })
}

export const getUserCartKey = (userId: string) => `CART-${userId}`;

export const getCartTicketKey = (eventId: string, ticketType: string) => ticketType + '-' + eventId;

export const envIsProd = () => {
  return process.env.NODE_ENV === 'production';
}

export const generatePaymentRef = () => {
  const timestamp = Date.now() + '';
  const randomNumber = Math.round(Math.random() * 10000000) + '';
  return parseInt(randomNumber + timestamp);
}

export const generatePromoterCode = () => nanoid();

export const getEventStartAndEndDate = (schedules: IEventSchedule[]): [Date, Date] => {
  const dates = schedules.map(schedule => new Date(schedule.date));
  const sortedDates = dates.sort(compareAsc);

  const start = sortedDates[0];
  const end = sortedDates[dates.length - 1];

  return [start, end];
}