import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// title, venue, date, description, image, tickets
@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  venue: string;

  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  image: string;

  @Prop()
  tickets: { name: string; price: number; description: string }[];

  @Prop()
  user_id: string;
}

export type EventDocument = Document & Event;
export const EventSchema = SchemaFactory.createForClass(Event);
