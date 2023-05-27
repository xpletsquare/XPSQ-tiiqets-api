import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { SuccessResponse } from "src/utilities/successMessage";
import { LoggedInGuard } from "../authentication/guards/loggedIn.guard";
import { CreateScannerDTO } from "./dtos/create-scanner.dto";
import { ScannerService } from './scanner.service';



@ApiTags("Scanner")
@Controller("scanner")
export class ScannerController {
  constructor(
    private scannerService: ScannerService,
  ) {}

  @UseGuards(LoggedInGuard)
  @Post("create")
  async createScanner(@Body() body: CreateScannerDTO) {
    // const scanner = await this.eventService.
    return new SuccessResponse("Scanner created successfully");
  }

  @Post("login")
  async scannerLogin(@Body()body: {eventCode: string, scannerCode: string }) {
    return new SuccessResponse("Scanner Loggedin Successfully");
  }

  @Get("check-ticket")
  async checkTicket(@Body() body: {ticketId?: string, L12TicketId?: string}){
    const ticketDetail = await this.scannerService.getTicketDetail(body.ticketId)
    if(!ticketDetail) return new NotFoundException("Ticket not found")
    return new SuccessResponse("Ticket Available", ticketDetail)
  }

  @Put("validate-ticket")
  async validateTicket(@Body() body: {ticketId: string}) {
    const ticketDetail = await this.scannerService.validateTicket(body.ticketId)
    if(!ticketDetail) return new BadRequestException("Ticket validation failed")
    return new SuccessResponse("Ticket Available", ticketDetail)
  }

}
