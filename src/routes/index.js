import Router from 'express';
import {router as routerTraslado} from '../modules/traslado/traslado.routes.js';
const router = Router();
import {buildPDF} from './pdfKit.js';
import TrasladoSchema from '../models/traslado.js';

router.use('/api/traslado', routerTraslado);

router.get('/api/export-pdf', async (_req, res) => {

    const { ids } = _req.query;
    const idsFormated = ids.split(',');
    const arrayDocuments = await TrasladoSchema.find({ _id: { $in: idsFormated } });
    const arrydocumentsMap = JSON.parse(JSON.stringify(arrayDocuments));
    
        const stream = res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Access-Control-Allow-Origin': '*',
        'Content-Disposition': 'attachment; filename=document.pdf',
      });

buildPDF(arrydocumentsMap ,(data) => {
    stream.write(data);
} , () => {
    stream.end();
} );

} );

export {
    router
}