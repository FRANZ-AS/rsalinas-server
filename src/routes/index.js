import Router from 'express';
import {router as routerTraslado} from '../modules/traslado/traslado.routes.js';
const router = Router();
router.get('/', (_req, res) => {
    res.send('Hola mundo');
});

router.use('/api/traslado', routerTraslado);

export {
    router
}