import mongoose from 'mongoose';

const TrasladoSchema = new mongoose.Schema({

    Cliente: { type: String, required: true }, //
    id: { type: String },
    Llamo: { type: String },
    RUT_Cliente: { type: String }, //
    Domicilio: { type: String }, //
    Ciudad: { type: String }, //
    Fecha: { type: String }, //
    Hora: { type: String }, //
    Estado: { type: String }, //
    Desde: { type: String },
    Hasta: { type: String },
    Patente: { type: String },
    Vehiculo: { type: String }, //
    Marca: { type: String }, //
    Modelo: { type: String }, //
    Color: { type: String }, //
    Chofer: { type: String }, //
    Finanzas: { type: String },
    Fecha_Cancelado: { type: String },
    Grua: { type: String }, //
    Fecha_Factura: { type: String },
    Facturado_a: { type: String },
    Factura: { type: String },
    Valor_Traslado: { type: String },
    Entrega_Factura: { type: String },
    Recibe_Factura: { type: String }, //
    Entrega_Vehiculo: { type: String },
    Recibe_Vehiculo: { type: String },
    Fecha_Ent_Veh: { type: String }, //
    Siniestro: { type: String }, //
    Inventario: { type: String }, //
    Guia: { type: String }, //
    Observaciones: { type: String }, //

    Con: { type: String },
    Receptor: { type: String },
    TotalRendido: { type: String },
    Bodegaje: { type: String },
    FechaRend: { type: String },
    Comision: { type: String },
    Otros: { type: String },
    Avises: { type: String },
    TotalCargos: { type: String },
    Encargo: { type: String },
    Abogado: { type: String },
    MartilleroJuicio: { type: String },
    MartilleroRenCuenta: { type: String },
 });

// module.exports = mongoose.model('Traslado', TrasladoSchema);
const Traslado = mongoose.model('Traslado', TrasladoSchema);

export default Traslado;
