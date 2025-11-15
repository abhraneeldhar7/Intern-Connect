import 'server-only';
import { ObjectId } from 'mongodb';

export interface IInternship {
  _id?: ObjectId | string;
  title: string;
  description: string;
  company: string;
  stipend: number;
  location: string;
  type: 'remote' | 'onsite' | 'hybrid';
  openings: number;
  skills: string[];
  createdBy: ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type InternshipDocument = IInternship & {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

