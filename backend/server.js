import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import categoryRouter from './routes/categoryRoute.js';
import filterRouter from './routes/filterRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

// app config

const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// middleware

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// api endpoints

app.use('/api/user', userRouter);
app.use('/api/product', productRouter); // Ensure this line is present
app.use('/api/category', categoryRouter);
app.use('/api/filter', filterRouter);
app.use('/api/cart', cartRouter); // Ensure this line is present
app.use('/api/orders', orderRouter); // Ensure this line is present

// Запускаем проверку каждую минуту
setInterval(() => {
  orderModel.removeExpiredProcessingOrders();
}, 60000);

app.get('/', (req, res) => {
  res.status(200).send('Api is running');
});

// listen

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
