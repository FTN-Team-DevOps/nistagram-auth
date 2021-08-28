import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type TRole = 'admin' | 'user';

export type AuthDocument = Auth & Document;

@Schema()
export class Auth {
  @Prop()
  user: string;
  @Prop()
  password: string;
  @Prop()
  email: string;
  @Prop()
  token: string;
  @Prop()
  role: TRole;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
