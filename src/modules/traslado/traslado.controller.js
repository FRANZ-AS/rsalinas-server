import { getRecordsTraslado, saveRecordTraslado, updateTraslado as updateTrasladoById, deleteTrasladoById } from "./traslado.service.js";
import { body, validationResult } from 'express-validator';

export const getTraslado = async (_req, res, _next) => {
    // console.log('getTraslado: ', _req.body);
    try {
        const records = await getRecordsTraslado(_req.body);
        res.json({
            success: true,
            message: "Traslados obtenidos correctamente",
            data: records,
            error: null
        });

    } catch (error) {
        console.log('Error en traslaodos', error);
        _next({
            success: false,
            message: "Error al obtener traslados",
            data: null,
            error: error
        })
    }
}

export const saveTraslado = async (_req, res, _next) => {

    console.log('saveTraslado: ', _req.body);
    
    await Promise.all(validationsCreate.map(validation => validation.run(_req)));
    const errors = validationResult(_req);
    console.log('errors validacion: ', errors);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
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
              console.log('Error en saveTraslado', error);
        _next({
            success: false,
            message: "Error al guardar traslado",
            data: null,
            error: error
        })
    }

}

export const updateTraslado = async (_req, res, _next) => {
    console.log('updateTraslado: ', _req.body);

    await Promise.all(validationsCreate.map(validation => validation.run(_req)));
    const errors = validationResult(_req);
    console.log('errors validacion: ', errors);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
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
        console.log('Error en update traslado', error);
        _next({
            success: false,
            message: "Error al actualizar traslado",
            data: null,
            error: error
        })
    }
}

export const deleteTraslado = async (_req, res, _next) => {
    console.log('deleteTraslado: ', _req.body);
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
        console.log('Error en deleteTraslado', error);
        _next({
            success: false,
            message: "Error al eliminar traslado",
            data: null,
            error: error
        })
    }

}

const validationsCreate = [
    body('Cliente', 'El nombre es requerido').notEmpty(),
    body('Llamo', 'El nombre es requerido').notEmpty(),
    body('RUT_Cliente', 'El nombre es requerido').notEmpty(),
    body('Domicilio', 'El nombre es requerido').notEmpty(),
    body('Ciudad', 'El nombre es requerido').notEmpty(),
    body('Fecha', 'El nombre es requerido').notEmpty(),
    body('Estado', 'El nombre es requerido').notEmpty(),
    body('Vehiculo', 'El nombre es requerido').notEmpty(),
    body('Marca', 'El nombre es requerido').notEmpty(),
    body('Modelo', 'El nombre es requerido').notEmpty(),
    body('Color', 'El nombre es requerido').notEmpty(),
    body('Chofer', 'El nombre es requerido').notEmpty(),
    body('Finanzas', 'El nombre es requerido').notEmpty(),
    body('Grua', 'El nombre es requerido').notEmpty(),
    body('Fecha_Factura', 'El nombre es requerido').notEmpty(),
    body('Facturado_a', 'El nombre es requerido').notEmpty(),
    body('Factura', 'El nombre es requerido').notEmpty(),
    body('Valor_Traslado', 'El nombre es requerido').notEmpty(),
    body('Entrega_Factura', 'El nombre es requerido').notEmpty(),
    body('Recibe_Factura', 'El nombre es requerido').notEmpty(),
    body('Recibe_Vehiculo', 'El nombre es requerido').notEmpty(),
    body('Fecha_Ent_Veh', 'El nombre es requerido').notEmpty(),
    body('Guia', 'El nombre es requerido').notEmpty(),
];


