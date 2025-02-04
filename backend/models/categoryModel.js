import mongoose from 'mongoose';

const localizedStringSchema = new mongoose.Schema(
  {
    en: { type: String, required: true },
    ru: { type: String, required: false },
  },
  { _id: false },
);

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: localizedStringSchema,
      required: true,
      trim: true,
      unique: true,
    },
    image: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    slug: {
      type: String,
      required: true,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null, // Верхнеуровневая категория, если null
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    filters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Filter',
      },
    ],
  },
  { timestamps: true },
);

// Middleware для обновления родительской категории при добавлении новой категории
categorySchema.post('save', async function (doc, next) {
  if (doc.parent) {
    try {
      const parentCategory = await mongoose.model('Category').findById(doc.parent);
      if (parentCategory) {
        if (!parentCategory.children.includes(doc._id)) {
          parentCategory.children.push(doc._id);
          await parentCategory.save();
        }
      }
    } catch (err) {
      console.error('Ошибка при обновлении родительской категории:', err);
    }
  }
  next();
});

// Middleware для удаления дочерней категории из родителя при удалении категории
categorySchema.pre('remove', async function (next) {
  if (this.parent) {
    try {
      const parentCategory = await mongoose.model('Category').findById(this.parent);
      if (parentCategory) {
        parentCategory.children = parentCategory.children.filter(
          (childId) => !childId.equals(this._id),
        );
        await parentCategory.save();
      }
    } catch (err) {
      console.error('Ошибка при удалении дочерней категории из родителя:', err);
    }
  }
  next();
});

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

export default Category;
