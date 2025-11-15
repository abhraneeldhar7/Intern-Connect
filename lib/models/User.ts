import 'server-only';
import { ObjectId } from 'mongodb';

export interface IUser {
  _id?: ObjectId | string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'applicant';
  bookmarks?: ObjectId[] | string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserDocument = IUser & {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

