import { ApiProperty } from "@nestjs/swagger";
import { User } from "../schemas/user.schema";

type UserDTO = Pick<
  User,
  "id" | "email" | "firstName" | "lastName" | "flagged" | "phone" | "activated"
>;

export class UserListResponse {
  @ApiProperty()
  status: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: UserDTO[];
}

export class SingleUserResponse {
  @ApiProperty()
  status: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: UserDTO;
}
