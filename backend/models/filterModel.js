import mongoose from 'mongoose';

const localizedStringSchema = new mongoose.Schema(
  {
    en: { type: String, required: true },
    ru: { type: String, required: false },
  },
  { _id: false },
);

const filterSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    label: {
      type: localizedStringSchema,
      required: true,
      trim: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
    },
    options: {
      type: [
        {
          type: {
            type: String,
            required: true,
            trim: true,
          },
          name: {
            type: localizedStringSchema,
            required: true,
            trim: true,
          },
          img: {
            type: String,
            required: false,
          },
          category: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Category',
            required: true,
          },
        },
      ],
      _id: false,
    },
  },
  { timestamps: true },
);

const Filter = mongoose.models.Filter || mongoose.model('Filter', filterSchema);

export default Filter;
