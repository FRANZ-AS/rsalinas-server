import  { Router } from 'express';
import { getTraslado, saveTraslado, deleteTraslado, updateTraslado } from './traslado.controller.js';

const router = Router();

router.get('/', getTraslado);
router.post('/', saveTraslado);
router.put('/:id', updateTraslado); // /api/traslado/${id}
router.delete('/:id', deleteTraslado); // /api/traslado/${id}

// export default router;
export {
    router
};