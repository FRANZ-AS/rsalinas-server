import Router from 'express';
import {router as routerTraslado} from '../modules/traslado/traslado.routes.js';
const router = Router();
import {buildPDF} from '../pdf/pdfTraslado.js';
import TrasladoSchema from '../models/traslado.js';
import {server} from '../index.js';
import { getFBAccessTokenLarge } from '../utils/files.js';

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

router.get('/' , (_req, res) => {
    res.send('Hello World');
} );

router.use('/api/traslado', routerTraslado);

router.use('/api/sign-facebook', async (_req, res) => {
  console.log('entramos a login facebook:', _req.body);
  try {
  const accessTokenLarge = await getFBAccessTokenLarge(_req.body.accessToken);
  console.log('accessTokenLarge:', accessTokenLarge)
    server.app.set ('facebookAccessToken', accessTokenLarge);
    server.app.use((req, res, next) => {
      req.facebookAccessToken = server.app.get('facebookAccessToken');
      next();
    });
    res.status(200).send('ok');
  } catch (error) {
    console.log('error:', error);
    res.status(500).send('error al obtener el token de facebook');
  }
 
});

router.get('/api/signout-facebook', async (_req, res) => {
  server.app.set ('facebookAccessToken', null);
  res.status(200).send('ok');
} );

router.get('/token', async (_req, res) => {
  console.log('server.app.get:', server.app.get('facebookAccessToken'));
  res.status(200).send(server.app.get('facebookAccessToken'));

} );

export {
    router
}