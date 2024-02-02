import {
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common";
import { NotFoundException } from "@nestjs/common";

export const AppLogger = new Logger("LOGS");

export const throwHttpError = (
  code: number,
  message = "",
  importantInfo = ""
) => {
  const status = "error";

  let exception = new BadRequestException({
    status,
    message,
  });

  switch (code) {
    case 404:
      message = message || "Not Found";
      exception = new NotFoundException({
        status,
        message,
      });
      break;

    case 403:
      message = message || "Not Authorized";
      exception = new UnauthorizedException({
        status,
        message,
      });
      break;

    case 401:
      message = message || "Not Authorized";
      exception = new UnauthorizedException({
        status,
        message,
      });
      break;

    case 400:
      message = message || "Bad Request";
      exception = new BadRequestException({
        status,
        message,
      });
      break;

    case 500:
      message = message || "Unable to process this action";
      exception = new InternalServerErrorException({
        status,
        message,
      });
      break;

    default:
      message = message || "Bad Request";
      exception = new BadRequestException({
        status,
        message,
      });
  }

  // TODO: Log exception before throwing
  const logMessage = `(EXCEPTION) - ${code} - ${
    importantInfo ? importantInfo : message
  }`;
  AppLogger.error(logMessage);

  throw exception;
};
