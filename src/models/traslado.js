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
        required: false
    },
    RUT_Cliente: {
        type: String,
        required: false
    },
    Domicilio: {
        type: String,
        required: false
    },
    Ciudad: {
        type: String,
        required: false
    },
    Fecha: {
        type: String,
        required: false
    },
    Estado: {
        type: String,
        required: false
    },
    Vehiculo: {
        type: String,
        required: false
    },
    Marca: {
        type: String,
        required: false
    },
    Modelo: {
        type: String,
        required: false
    },
    Color: {
        type: String,
        required: false
    },
    Chofer: {
        type: String,
        required: false
    },
    Finanzas: {
        type: String,
        required: false
    },
    Grua: {
        type: String,
        required: false
    },
    Fecha_Factura: {
        type: String,
        required: false
    },
    Facturado_a: {
        type: String,
        required: false
    },
    Factura: {
        type: String,
        required: false
    },
    Valor_Traslado: {
        type: String,
        required: false
    },
    Entrega_Factura: {
        type: String,
        required: false
    },
    Recibe_Factura: {
        type: String,
        required: false
    },
    Recibe_Vehiculo: {
        type: String,
        required: false
    },
    Fecha_Ent_Veh: {
        type: String,
        required: false
    },
    Guia: {
        type: String,
        required: false
    }
 });

// module.exports = mongoose.model('Traslado', TrasladoSchema);
const Traslado = mongoose.model('Traslado', TrasladoSchema);

export default Traslado;