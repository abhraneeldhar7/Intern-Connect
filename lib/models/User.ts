import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'applicant';
  bookmarks?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['admin', 'applicant'],
      default: 'applicant',
    },
    bookmarks: {
      type: [Schema.Types.ObjectId],
      ref: 'Internship',
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

let User: Model<IUser>;

if (mongoose.models && mongoose.models.User) {
  User = mongoose.models.User as Model<IUser>;
} else {
  User = mongoose.model<IUser>('User', UserSchema);
}

export default User;

