import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import categoryRouter from './routes/categoryRoute.js';
import filterRouter from './routes/filterRoute.js';

// app config

const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// middleware

app.use(express.json());
app.use(cors());

// api endpoints

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/category', categoryRouter);
app.use('/api/filter', filterRouter);

app.post('/api/filter/create', async (req, res) => {
  try {
    const { key, label, type, options } = req.body;
    const newFilter = new Filter({
      key,
      label,
      type,
      options: options.map((option) => ({
        type: option.type,
        img: option.img || '',
      })),
    });
    const savedFilter = await newFilter.save();
    res.status(201).json(savedFilter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/', (req, res) => {
  res.status(200).send('Api is running');
});

// listen

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
