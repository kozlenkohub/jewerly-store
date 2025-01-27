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
      type: [
        {
          type: {
            type: String,
            required: true,
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
