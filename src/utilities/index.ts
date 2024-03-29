/* eslint-disable @typescript-eslint/no-var-requires */

import { CONFIG } from "src/config";
import { customAlphabet } from "nanoid";
import { IEventSchedule } from "src/interfaces";
const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNPQRSTUV", 10);
import { format, compareAsc } from "date-fns";

const qrcodeReader = require("qrcode");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("graceful-fs");
const { v4: uuidv4 } = require("uuid");

export type Timestamp = number;

export const hashPassword = (plainPassword: string) => {
  const hash = bcrypt.hashSync(plainPassword, 11);
  return hash;
};

export const createJWTWithPayload = (payload: any) => {
  const token = jwt.sign(payload, "y(xQiYmM,Z}^cb>");
  payload.token = token;
  return payload;
};

export const verifyAndDecodeJWTToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, "y(xQiYmM,Z}^cb>");
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

export const removeUnusedImage = async (imagePath = "") => {
  if (!imagePath) return;

  const fileExists = fs.existsSync(imagePath);
  if (!fileExists) return;

  await fs.promises.rm(imagePath);
  console.log("file deleted");
};

export const generateId = (): string => {
  return uuidv4();
};

export const cleanObject = (data: any) => {
  const copy = { ...data };

  Object.keys(data).forEach((key) => {
    const value = data[key];
    const isEmpty = [null, undefined, ""].includes(value);

    if (isEmpty) {
      delete copy[key];
    }
  });

  return copy;
};

export const isValidRating = (value: string | number) => {
  const parsed = Number(value + "");
  return [1, 2, 3, 4, 5].includes(parsed);
};

export const normalizeRating = (value: string | number) => {
  const ratingAsNumber = Number(value + "");
  return ratingAsNumber.toFixed(1);
};

export const generatePin = (numLength = 6) => {
  if (CONFIG.NODE_ENV === "development") {
    return 123456;
  }
  const pinWithDecimals = Math.random() * 10**numLength;
  const pinAsString = Math.ceil(pinWithDecimals) + '';
  return pinAsString.length === numLength ? pinAsString : generatePin(numLength);
};

export const getQRCode = async (value): Promise<string> => {
  return new Promise((resolve) => {
    const valueAsString = JSON.stringify(value);

    qrcodeReader.toDataURL(valueAsString, (err: any, url: string) => {
      if (err) {
        console.log("QRCODE ERROR: ", err.message || err);
      }

      resolve(url || null);
    });
  });
};

export const getQRCodeToFile = async (value, filename): Promise<string> => {
  return new Promise((resolve) => {
    const valueAsString = value;
    // const valueAsString = JSON.stringify(value);

    const path = "qr/"+filename+".png";
    // const path = __dirname+"/"+filename+".png";
    
    qrcodeReader.toFile(path, valueAsString, {
      width: 200,
      margin: 1,
      color: {
        dark:"#002D02",
        light:"#FFFFFF"
      }
    }, (err:any) => {
      if (err) console.log("QR Error: ", err.message || err);
      resolve(path || null);
    })
  
  });

};

export const getUserCartKey = (userId: string) => `CART-${userId}`;

export const getCartTicketKey = (eventId: string, ticketType: string) =>
  ticketType + "-" + eventId;

export const envIsProd = () => {
  return process.env.NODE_ENV === "production";
};

export const generatePaymentRef = () => {
  const timestamp = Date.now() + "";
  const randomNumber = Math.round(Math.random() * 10000000) + "";
  return parseInt(randomNumber + timestamp);
};

export const generatePromoterCode = () => nanoid();

export const formatCurrency = (value: number, removeDecimals = true) => {
  const options = { style: 'currency', currency: 'NGN' };
  const formattedValue = value.toLocaleString('en-NG', options);
  return removeDecimals ? formattedValue.split('.')[0] : formattedValue;
}

export const getEventStartAndEndDate = (
  schedules: IEventSchedule[]
): [Timestamp, Timestamp] => {
  const dates = schedules.map((schedule) => new Date(schedule.date).getTime());
  const sortedDates = dates.sort(compareAsc);

  const start = sortedDates[0];
  const end = sortedDates[dates.length - 1];

  return [start, end];
};

export const generateSixDigitCode = () =>  Math.random().toString(36).substring(2,7).toUpperCase();