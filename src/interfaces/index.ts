import { User } from "src/api/user/schemas/user.schema";


export type UserDTO = Pick<User, 'id' | 'email' | 'firstName' | 'lastName' | 'phone' | 'flagged' | 'activated'>

export type UserWithActivationPin = {
  user: UserDTO | Partial<User>,
  activationPin: number
}

export type UserWithResetPin = {
  user: UserDTO,
  resetPin: number
}