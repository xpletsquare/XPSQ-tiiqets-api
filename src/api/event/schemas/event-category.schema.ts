import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class EventCategory extends Document {
  @Prop({ unique: true, required: true })
  id: string;

  @Prop({ unique: true, required: true })
  name: string;

  toDto: () => Partial<EventCategory>;
}

export type EventCategoryDocument = Document & EventCategory;
export const EventCategorySchema = SchemaFactory.createForClass(EventCategory);

EventCategorySchema.methods.toDto = function () {
  const { id, name } = this;
  return { id, name };
};
