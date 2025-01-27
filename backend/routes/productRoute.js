import express from 'express';
import { addProduct, getProducts, insertProducts } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post('/add', addProduct);
productRouter.get('/', getProducts);
productRouter.get('/:category', getProducts);
productRouter.post('/insert', insertProducts); // Route to insert products

export default productRouter;
