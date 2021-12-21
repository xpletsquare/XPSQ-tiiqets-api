import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";


@Injectable()
export class PaystackService {
  constructor(
    private httpClient: HttpService,
  ) { }



}