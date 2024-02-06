import { getRecordsTraslado, getRecordTrasladoByIdByNameFile, saveRecordTraslado, addFilesById, updateTraslado as updateTrasladoById, deleteTrasladoById, deleteFileByIdAndName, updateUrlFileById, updateUrlFileByIdFacebook } from "./traslado.service.js";
import { body, validationResult } from 'express-validator';
import { proccesingFiles } from "../../utils/files.js";
import { getSourceMediaFacebook, deleteFileInGoogleDrive } from "../../utils/files.js";

export const getTraslados = async (_req, res, _next) => {
    try {
        const records = await getRecordsTraslado(_req.query);
        const recordsMap = JSON.parse(JSON.stringify(records));

        const data = [];
            
        for (const record of recordsMap.data) {
            
            let files = [];
            for (const file of record.files) {
                
                if(file.url && file.url.includes('google' && file.facebookId)) {
                    const dataFace = await getSourceMediaFacebook(file.facebookId);
                    if(dataFace.source && file.driveId) {
                        deleteFileInGoogleDrive(file.driveId)
                        updateUrlFileById(record._id, file.name, dataFace.source);
                    }
                    files.push({
                        ...file,
                        driveId: dataFace.source ? null : file.driveId,
                        url: dataFace.source
                    });
                } else {
                    files.push(file);
                }
            };

            data.push({ ...record, files: [...files] });
        }
    
        res.json({
            success: true,
            message: "Traslados obtenidos correctamente",
            data: { ...recordsMap, data: [...data]},
            error: null
        });

    } catch (error) {
        console.log('error:', error);
        _next({
            success: false,
            message: "Error al obtener traslados",
            data: null,
            error: error
        })
    }
}

export const saveTraslado = async (_req, res, _next) => {
    
    await Promise.all(validationsCreate.map(validation => validation.run(_req)));
    const errors = validationResult(_req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let files = [];
    
    try {

        if (_req.files && files.length > 0) files = await proccesingFiles(_req.files['files[]'], _req.body.id);
        if (files.length > 0) _req.body.files = files;

        const record = await saveRecordTraslado(_req.body);
        res.json(
            {
                success: true,
                message: "Traslado guardado correctamente",
                data: record,
                error: null
            }
        );
    } catch (error) {

        console.log('error saveTraslado:', error);
        if (error.message === 'UnauthorizedError') {
            _next(error.message)
        } else {
            _next({
                success: false,
                message: "Error al guardar traslado",
                data: null,
                error: error
            })
        }
    }

}

export const updateTraslado = async (_req, res, _next) => {

    await Promise.all(validationsCreate.map(validation => validation.run(_req)));
    const errors = validationResult(_req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        if (_req.files && _req.files['files[]']) {
            const files = await proccesingFiles(_req.files['files[]'], _req.body.id);
            if (files.length > 0) {
                await addFilesById(_req.params.id, files);
            }
        }
    } catch (error) {
        console.log('error updateTraslado:', error);
        if (error.message === 'UnauthorizedError') {
            _next(error.message)
        } else {
            _next({
                success: false,
                message: "Error al actualizar traslado",
                data: null,
                error: error
            })
        }
    }
    
    try {
        const id = _req.params.id;
        const record = await updateTrasladoById(id, _req.body);
        res.json({
            success: true,
            message: "Traslado actualizado correctamente",
            data: record,
            error: null
        });

    } catch (error) {
        _next({
            success: false,
            message: "Error al actualizar traslado",
            data: null,
            error: error
        })
    }
}

export const deleteTraslado = async (_req, res, _next) => {
    try {
        const id = _req.params.id;
        const record = await deleteTrasladoById(id);
        res.json({
                success: true,
                message: "Traslado eliminado correctamente",
                data: record,
                error: null
        });
    } catch (error) {
        _next({
            success: false,
            message: "Error al eliminar traslado",
            data: null,
            error: error
        })
    }

}

export const deleteFile = async (_req, res, _next) => {
    try {
        const id = _req.params.id;
        const nameFile = _req.body.nameFile;
        // recuperar objeto de l array de files
        const objFile = await getRecordTrasladoByIdByNameFile(id, nameFile);
        if(objFile && objFile.driveId) {
            deleteFileInGoogleDrive(objFile.driveId);
        }
        const record = await deleteFileByIdAndName(id, nameFile);
        res.json({
            success: true,
            message: "Archivo eliminado correctamente",
            data: record,
            error: null
        });
    } catch (error) {
        console.log('error deletFile:', error);
        _next({
            success: false,
            message: "Error al eliminar archivo",
            data: null,
            error: error
        })
    }

}

export const updateLinkImageFB = async (_req, res, _next) => {
    try {
        const id = _req.body.id;
        const idFacebook = _req.body.idFacebook;
        const url =  await getSourceMediaFacebook(idFacebook);
        const recordFile = await updateUrlFileByIdFacebook(id, idFacebook, url.source);
        res.json({
            success: true,
            message: "Archivo actualizado correctamente",
            data: recordFile,
            error: null
        });
    } catch (error) {
        console.log('error updateLinkImageFB:', error.message);

        if (error.message === 'UnauthorizedError') {
            _next(error.message)
        } else {
            _next({
                success: false,
                message: "Error al actualizar archivo",
                data: null,
                error: error
            })
        }
    }

}

const validationsCreate = [
    body('Cliente', 'El nombre es requerido').notEmpty(),
    // body('Llamo', 'El nombre es requerido').notEmpty(),
    // body('RUT_Cliente', 'El nombre es requerido').notEmpty(),
    // body('Domicilio', 'El nombre es requerido').notEmpty(),
    // body('Ciudad', 'El nombre es requerido').notEmpty(),
    // body('Fecha', 'El nombre es requerido').notEmpty(),
    // body('Estado', 'El nombre es requerido').notEmpty(),
    // body('Vehiculo', 'El nombre es requerido').notEmpty(),
    // body('Marca', 'El nombre es requerido').notEmpty(),
    // body('Modelo', 'El nombre es requerido').notEmpty(),
    // body('Color', 'El nombre es requerido').notEmpty(),
    // body('Chofer', 'El nombre es requerido').notEmpty(),
    // body('Finanzas', 'El nombre es requerido').notEmpty(),
    // body('Grua', 'El nombre es requerido').notEmpty(),
    // body('Fecha_Factura', 'El nombre es requerido').notEmpty(),
    // body('Facturado_a', 'El nombre es requerido').notEmpty(),
    // body('Factura', 'El nombre es requerido').notEmpty(),
    // body('Valor_Traslado', 'El nombre es requerido').notEmpty(),
    // body('Entrega_Factura', 'El nombre es requerido').notEmpty(),
    // body('Recibe_Factura', 'El nombre es requerido').notEmpty(),
    // body('Recibe_Vehiculo', 'El nombre es requerido').notEmpty(),
    // body('Fecha_Ent_Veh', 'El nombre es requerido').notEmpty(),
    // body('Guia', 'El nombre es requerido').notEmpty(),
];


