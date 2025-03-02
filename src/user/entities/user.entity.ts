import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({
  _id: false,
  timestamps: true,
})
export class User {
  @Prop({
    type: String,
    default: uuidv4,
  })
  _id: string;

  @Prop()
  name: string;

  @Prop({
    unique: [true, 'Duplicate email entered.'],
  })
  email: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ _id: 1 }, { unique: true });
