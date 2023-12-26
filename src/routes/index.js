import Router from 'express';
import {router as routerTraslado} from '../modules/traslado/traslado.routes.js';
const router = Router();
import {buildPDF} from '../pdf/pdfTraslado.js';
import TrasladoSchema from '../models/traslado.js';
import multer from 'multer';
import { google } from 'googleapis';
import { credentials } from '../auth-google/keys.js';
import stream from 'stream';
// import { saveTraslado } from '../modules/traslado/traslado.controller.js';


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


// Configura la autenticación de Google Drive
// const credentials = require('../auth-google/keys.json');
const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  ['https://www.googleapis.com/auth/drive']
);
const drive = google.drive({ version: 'v3', auth });

// Configura multer para manejar la carga de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use('/api/traslado', routerTraslado);

// router.post('/api/traslado-files', upload.fields([{ name: 'files[]', maxCount: 10 }, { name: 'Cliente'}]), saveTraslado);


router.post('/api/upload-files', upload.single('file'), async (req, res) => {
    console.log('req.file:', req.file);
  try {
    const file = req.file;
    const mimetype = file.mimetype;
    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);
    const driveResponse = await drive.files.create({
        requestBody: {
        name: file.originalname,
        parents: ["1B2LqBytLfVKmcw-LHjdR_9Q5A9rzH7kE"]
      },
      media: {
        mimeType: mimetype,
        body: bufferStream
      },
        fields: 'id, webViewLink, webContentLink'
    }).catch((err) => {
        console.log('err in save:', err);
    });

    console.log('res drive:', driveResponse);

    res.status(200).json({
      link: driveResponse.data.webViewLink,
      id: driveResponse.data.id
    });
  } catch (error) {
    console.log('error:', error);
    res.status(500).json({ error: error });
  }
});

// Ruta para obtener el enlace público de descarga de un archivo en Google Drive
router.get('/api/get-link/:fileId', async (req, res) => {
    try {
      const fileId = req.params.fileId;
  
      // Obtiene la información del archivo para obtener el enlace público
      const response = await drive.files.get({
        fileId: fileId,
        fields: 'webContentLink',
      });
  
      const publicDownloadLink = response.data.webContentLink;
      console.log('Enlace público de descarga del archivo:', publicDownloadLink);
  
      res.json({ success: true, publicDownloadLink });
    } catch (error) {
      console.error('Error al obtener el enlace público de descarga del archivo:', error.message);
      res.status(500).json({ success: false, error: error.message });
    }
});

  // Ruta para eliminar un archivo en Google Drive
router.delete('/api/delete-file/:fileId', async (req, res) => {
    try {
      const fileId = req.params.fileId;
  
      // Elimina el archivo
      await drive.files.delete({
        fileId: fileId,
      });
  
      console.log('Archivo eliminado exitosamente.');
  
      res.json({ success: true });
    } catch (error) {
      console.error('Error al eliminar el archivo:', error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  });

export {
    router
}