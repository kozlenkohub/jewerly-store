import mongoose from 'mongoose';

const filterSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
    },
  },
  { timestamps: true },
);

const Filter = mongoose.models.Filter || mongoose.model('Filter', filterSchema);

export default Filter;
