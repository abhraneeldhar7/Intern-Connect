import mongoose, { Schema, Model, Types } from 'mongoose';

export interface IApplication {
  _id?: string;
  internshipId: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  resumeUrl: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    internshipId: {
      type: Schema.Types.ObjectId,
      ref: 'Internship',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resumeUrl: {
      type: String,
      required: [true, 'Resume URL is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications
ApplicationSchema.index({ internshipId: 1, userId: 1 }, { unique: true });

let Application: Model<IApplication>;

if (mongoose.models && mongoose.models.Application) {
  Application = mongoose.models.Application as Model<IApplication>;
} else {
  Application = mongoose.model<IApplication>('Application', ApplicationSchema);
}

export default Application;

