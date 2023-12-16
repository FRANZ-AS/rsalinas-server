import  { Router } from 'express';
import { getTraslados, saveTraslado, deleteTraslado, updateTraslado } from './traslado.controller.js';

const router = Router();

router.get('/', getTraslados);
router.post('/', saveTraslado);
router.patch('/:id', updateTraslado); 
router.delete('/:id', deleteTraslado);

export {
    router
};