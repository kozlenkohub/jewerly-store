import express from 'express';
import Filter from '../models/filterModel.js';
import { createFilter } from '../controllers/filterController.js';

const filterRouter = express.Router();

filterRouter.post('/', async (req, res) => {
  try {
    const filter = new Filter(req.body);
    await filter.save();
    res.status(201).send(filter);
  } catch (error) {
    res.status(400).send(error);
  }
});

filterRouter.post('/create', createFilter);

filterRouter.get('/', async (req, res) => {
  try {
    const filters = await Filter.find({});
    res.status(200).send(filters);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default filterRouter;
