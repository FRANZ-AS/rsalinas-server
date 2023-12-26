import TrasladoSchema from '../../models/traslado.js';

export async function getRecordsTraslado(req) {
    const { 
        page = 1,
        limit = 10,
        search = '',
        filterDate = 'false',
        dateFilterType = 'Fecha',
        dateRange = { startDate: '', endDate: '' }
    } = req;

    const { startDate = '', endDate = ''} = dateRange;

    const countRecords = await TrasladoSchema.countDocuments();

    const filters = {};

    if(filterDate === 'true' && startDate && endDate) {
        if(dateFilterType === 'Fecha') {
            filters.Fecha = { $gte: startDate, $lte: endDate };
        } 
        if(dateFilterType === 'Fecha_Ent_Veh') {
            filters.Fecha_Ent_Veh = { $gte: startDate, $lte: endDate };
        }
    }

    if(search) {
        filters.$or = [
            { Ciudad: { $regex: new RegExp(search, 'i') } },
            { Estado: { $regex: new RegExp(search, 'i') } },
            { Vehiculo: { $regex: new RegExp(search, 'i') } },
            { Marca: { $regex: new RegExp(search, 'i') } },
            { Modelo: { $regex: new RegExp(search, 'i') } },
            { Cliente: { $regex: new RegExp(search, 'i') } }, // 'i' para que sea insensible a mayúsculas y minúsculas
        ];
    }

    const countRecordsSearch = Object.keys(filters).length ? await TrasladoSchema.countDocuments(filters) : 0;


    let records = null;
    records = await TrasladoSchema.find(Object.keys(filters).length ? filters : {})
        .limit(limit)
        .skip((page - 1) * limit)
        .exec();

    return {
            totalRows: Object.keys(filters).length ? countRecordsSearch : countRecords,
            currentPage: page,
            data: records
        };
}

export async function saveRecordTraslado(req) {
    const newRecord = new TrasladoSchema(req);
    return await newRecord.save();
}

export async function updateTraslado(id, req ) {
    const updateRecord = await TrasladoSchema.findByIdAndUpdate(id, req, { new: true });
    return updateRecord;
}

export async function deleteTrasladoById(id){
    const deleteRecord = await TrasladoSchema.findByIdAndDelete(id);
    return deleteRecord;
}

export async function addFilesById(id, files) {
    const updateRecord = await TrasladoSchema.updateOne({ _id: id }, { $push: { files: { $each: files } } });
    return updateRecord;
}

export async function deleteFileByIdAndName(id, nameFile) {
    const deleteRecord = await TrasladoSchema.updateOne({ _id: id }, { $pull: { files: { name: nameFile } } });
    return deleteRecord;
}

export async function updateUrlFileById(id, nameFile, urlFacebook) {
    const updateRecord = await TrasladoSchema.updateOne({ _id: id, "files.name": nameFile }, { $set: { "files.$.url": urlFacebook, "files.$.driveId": null } });
    return updateRecord;
}