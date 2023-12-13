import mongoose from 'mongoose';

const TrasladoSchema = new mongoose.Schema({

    // id: {
    //     type: Number,
    //     required: true,
    //     unique: true
    // },
    Cliente: {
        type: String,
        required: true
    },
    Llamo: {
        type: String,
        required: true
    },
    RUT_Cliente: {
        type: String,
        required: true
    },
    Domicilio: {
        type: String,
        required: true
    },
    Ciudad: {
        type: String,
        required: true
    },
    Fecha: {
        type: String,
        required: true
    },
    Estado: {
        type: String,
        required: true
    },
    Vehiculo: {
        type: String,
        required: true
    },
    Marca: {
        type: String,
        required: true
    },
    Modelo: {
        type: String,
        required: true
    },
    Color: {
        type: String,
        required: true
    },
    Chofer: {
        type: String,
        required: true
    },
    Finanzas: {
        type: Number,
        required: true
    },
    Grua: {
        type: String,
        required: true
    },
    Fecha_Factura: {
        type: Number,
        required: true
    },
    Facturado_a: {
        type: Number,
        required: true
    },
    Factura: {
        type: Number,
        required: true
    },
    Valor_Traslado: {
        type: Number,
        required: true
    },
    Entrega_Factura: {
        type: Number,
        required: true
    },
    Recibe_Factura: {
        type: Number,
        required: true
    },
    Recibe_Vehiculo: {
        type: Number,
        required: true
    },
    Fecha_Ent_Veh: {
        type: String,
        required: true
    },
    Guia: {
        type: String,
        required: true
    }
 });

// module.exports = mongoose.model('Traslado', TrasladoSchema);
const Traslado = mongoose.model('Traslado', TrasladoSchema);

export default Traslado;