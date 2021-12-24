import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { UserDTO } from "src/interfaces";
import { passwordMatches } from "src/utilities";

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ default: false })
  activated: boolean;

  @Prop({ required: true })
  hashedPassword: string

  @Prop({ default: false })
  flagged: boolean;

  toDto(): UserDTO {
    return
  } // implemented in schema methods

  checkPassword(password: string): boolean { // implemented in schema methods
    return;
  }
}

export type UserDocument = Document & User;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.toDto = function () {
  const { id, email, phone, firstName, lastName, activated, flagged } = this as UserDocument;
  return { id, email, phone, firstName, lastName, activated, flagged }
}

UserSchema.methods.checkPassword = function (password: string) {
  const { hashedPassword } = this as UserDocument;
  return passwordMatches(password, hashedPassword);
}