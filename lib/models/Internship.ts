import mongoose, { Schema, Model, Types } from 'mongoose';

export interface IInternship {
  _id?: string;
  title: string;
  description: string;
  company: string;
  stipend: number;
  location: string;
  type: 'remote' | 'onsite' | 'hybrid';
  openings: number;
  skills: string[];
  createdBy: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

const InternshipSchema = new Schema<IInternship>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true,
    },
    stipend: {
      type: Number,
      required: [true, 'Stipend is required'],
      min: 0,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['remote', 'onsite', 'hybrid'],
      required: [true, 'Type is required'],
    },
    openings: {
      type: Number,
      required: [true, 'Openings is required'],
      min: 1,
    },
    skills: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

let Internship: Model<IInternship>;

if (mongoose.models && mongoose.models.Internship) {
  Internship = mongoose.models.Internship as Model<IInternship>;
} else {
  Internship = mongoose.model<IInternship>('Internship', InternshipSchema);
}

export default Internship;

