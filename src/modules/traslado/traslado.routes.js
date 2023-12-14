import  { Router } from 'express';
import { getTraslados, saveTraslado, deleteTraslado, updateTraslado } from './traslado.controller.js';

const router = Router();

router.get('/', getTraslados);
router.post('/', saveTraslado);
router.patch('/:id', updateTraslado); // /api/traslado/${id}
router.delete('/:id', deleteTraslado); // /api/traslado/${id}

// export default router;
export {
    router
};