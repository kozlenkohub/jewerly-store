import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Уникальное название категории
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category', // Ссылка на родительскую категорию
      default: null, // Верхнеуровневая категория, если null
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Ссылки на дочерние категории
      },
    ],
    icon: {
      type: String, // Путь или имя файла для иконки категории
      default: null,
    },
    filters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Filter', // Ссылки на фильтры, связанные с категорией
      },
    ],
    // Удаляем поле slug
    // slug: {
    //   type: String,
    //   slug: 'name', // Генерация slug на основе имени
    //   unique: true, // Гарантируем уникальность
    // },
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
