import TrasladoSchema from '../../models/traslado.js';

export async function getRecordsTraslado(req) {
    // console.log('getRecordsTraslado: ', req);
    const { page = 1, limit = 10, search = '' } = req;
    const countRecords = await TrasladoSchema.countDocuments();

    const consultaSearch = {
        $or: [
          { Cliente: { $regex: new RegExp(search, 'i') } }, // 'i' para que sea insensible a mayúsculas y minúsculas
          { Ciudad: { $regex: new RegExp(search, 'i') } },
          { Estado: { $regex: new RegExp(search, 'i') } },
          { Vehiculo: { $regex: new RegExp(search, 'i') } },
          { Marca: { $regex: new RegExp(search, 'i') } },
          { Modelo: { $regex: new RegExp(search, 'i') } },
        //   { Color: { $regex: new RegExp(search, 'i') } },
        //   { Chofer: { $regex: new RegExp(search, 'i') } },
        //   { Finanzas: { $regex: new RegExp(search, 'i') } },
        ],
    };

    const countRecordsSearch = search ? await TrasladoSchema.countDocuments(consultaSearch) : 0;


    let records = null;
    records = await TrasladoSchema.find(search ? consultaSearch : null)
        .limit(limit)
        .skip((page - 1) * limit)
        .exec();

    // else records = await TrasladoSchema.find(consultaSearch)
    //     .limit(limit)
    //     .skip((page - 1) * limit)
    //     .exec();

    return {
            totalRows: search ? countRecordsSearch : countRecords,
            currentPage: page,
            data: records
        };
}

export async function saveRecordTraslado(req) {
    const newRecord = new TrasladoSchema(req);
    return await newRecord.save();
}

export async function updateTraslado(id, req ) {
    const updateRecord = await TrasladoSchema.findByIdAndUpdate(id, req);
    return updateRecord;
}

export async function deleteTrasladoById(id){
    const deleteRecord = await TrasladoSchema.findByIdAndDelete(id);
    return deleteRecord;
}