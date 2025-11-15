import 'server-only';
import { ObjectId } from 'mongodb';

export interface IApplication {
  _id?: ObjectId | string;
  internshipId: ObjectId | string;
  userId: ObjectId | string;
  resumeUrl: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
}

export type ApplicationDocument = IApplication & {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

