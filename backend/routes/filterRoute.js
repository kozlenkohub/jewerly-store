import express from 'express';
import {
  createFilter,
  getAllFilters,
  getFilterById,
  updateFilter,
  deleteFilter,
  populateFilters,
} from '../controllers/filterController.js';

const filterRouter = express.Router();

filterRouter.post('/create', createFilter);
filterRouter.get('/', getAllFilters);
filterRouter.get('/:id', getFilterById);
filterRouter.put('/:id', updateFilter);
filterRouter.delete('/:id', deleteFilter);
filterRouter.post('/populate', populateFilters);

export default filterRouter;
