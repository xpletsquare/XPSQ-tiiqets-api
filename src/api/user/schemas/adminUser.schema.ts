import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { passwordMatches } from "src/utilities";


@Schema({ timestamps: true })
export class AdminUser extends Document {
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

  @Prop({ required: true })
  hashedPassword: string

  @Prop({ default: false })
  flagged: boolean;

  toDto(): Partial<AdminUser> {
    return
  } // implemented in schema methods

  checkPassword(password: string): boolean { // implemented in schema methods
    return;
  }
}

export type AdminUserDocument = Document & AdminUser;
export const AdminUserSchema = SchemaFactory.createForClass(AdminUser);

AdminUserSchema.methods.toDto = function () {
  const { id, email, phone, firstName, lastName } = this as any;
  return { id, email, phone, firstName, lastName }
}

AdminUserSchema.methods.checkPassword = function (password: string) {
  const { hashedPassword } = this as any;
  return passwordMatches(password, hashedPassword);
}