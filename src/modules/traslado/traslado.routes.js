import  { Router } from 'express';
import { getTraslados, saveTraslado, deleteTraslado, updateTraslado, deleteFile } from './traslado.controller.js';
import multer from 'multer';
const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', getTraslados);
router.post('/', upload.fields([{ name: 'files[]', maxCount: 10 }, { name: 'Cliente'}]), saveTraslado);
router.patch('/:id',  upload.fields([{ name: 'files[]', maxCount: 10 }]), updateTraslado); 
router.delete('/:id', deleteTraslado);
router.post('/:id/delete-file', deleteFile); 
export {
    router
};