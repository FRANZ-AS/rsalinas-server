import TrasladoSchema from '../../models/traslado.js';

export async function getRecordsTraslado(req) {

    const { page = 1, limit = 10 } = req;
    const countRecords = await TrasladoSchema.countDocuments();
    const records = await TrasladoSchema.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    return {
            totalPages: countRecords,
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