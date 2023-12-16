import PDFDocument from 'pdfkit-table';
import moment from 'moment';

const buildPDF = async (arrayDocuments, dataCallback, endCallback) => {
  
    const doc = new PDFDocument();
    doc.on('data', dataCallback);
    doc.on('end', endCallback);


    const marginLeft = 1;
    const marginTop = 1;
    const marginRight = 1;
    const marginBottom = 1;

    doc.page.margins = {
        top: marginTop,
        bottom: marginBottom,
        left: marginLeft,
        right: marginRight,
    };
    
    const formatDate = (date) => {
        try {
            return moment(date).format('DD-MM-YYYY HH:mm:ss');
        } catch (error) {
            return '---';
        }
    }
    // arrayDocuments.map( async (document, index) => {
        let i = 1; 
        for (const document of arrayDocuments) {
            const table1 = {
                title: "Antecedentes del Juicio",
                headers: [ "Juicio"],
                rows: [
                  [ document.Cliente || '--'],
                ],
              };
          
              const table2 = {
                  headers: [ "Domicilio", "RUT" ],
                  rows: [
                    [ document.Domicilio || '--', document.RUT_Cliente || '--' ],
                  ],
              };
              const table3 = {
                  headers: [ "Estado", "Ciudad" ],
                  rows: [
                    [ document.Estado || '--', document.Ciudad || '--' ],
                  ],
              };
              const table4 = {
                  headers: [ "Jurisdicción", "Fecha Estado" ],
                  rows: [
                    [ document.Siniestro || '--', formatDate(document.Fecha) || '--' ],
                  ],
              };
          
              const table5 = {
                  headers: [ "Encargo", "Hora" ],
                  rows: [
                    [document.Encargo || '--', document.Hora || '--']
                  ],
              };
          
              const table6 = {
                  headers: [ "Abogado", "Juzgado" ],
                  rows: [
                    [ document.Abogado || '--', document.Guia || '--']
                  ],
              };
          
              const table7 = {
                  headers: [ "Depositario", "Rol " ],
                  rows: [
                    [ document.MartilleroJuicio || '--', document.Inventario || '--' ],
                  ],
              };
          
              const table8 = {
                  headers: [ "Vehículo", "Fecha Encargo" ],
                  rows: [
                    [ document.Vehiculo || '--', formatDate(document.Fecha_Ent_Veh) || '--' ],
                  ],
              };
          
              const table9 = {
                  headers: [ "Patente", "Receptor" ],
                  rows: [
                    [ document.Patente || '--', document.Receptor || '--' ],
                  ],
              };
          
              const table10 = {
                  headers: [ "Quien entrega", "Marca" ],
                  rows: [
                    [ document.Chofer || '--', document.Marca || '--' ],
                  ],
              };
          
              const table11 = {
                  headers: [ "Año y color", "Bodega" ],
                  rows: [
                    [ document.Color || '--', document.Grua || '--' ],
                  ],
              };
          
              const table12 = {
                  title: "Antecedentes de la Rendición de Cuenta",
                  headers: [ "Total rendido", "Fecha Rend", "N° Recibe"],
                  rows: [
                    [document.TotalRendido || '--', formatDate(document.FechaRend) || '--', document.Recibe_Factura || '--'],
                  ],
              };
          
              const table13 = {
                  headers: [ "Martillero", "Comisión", "Avises"],
                  rows: [
                    [ document.MartilleroRenCuenta || '--', document.Comision || '--', document.Avises || '--']
                  ],
              };
          
              const table14 = {
                  headers: [ "Bodegaje", "Otros", "Total Cargos"],
                  rows: [
                    [ document.Bodegaje || '--', document.Otros || '--', document.TotalCargos || '--']
                  ],
              };
          
              await doc.table(table1, { 
                columnsSize: [ 480 ],
              });
          
              await doc.table(table2, { 
                  columnsSize: [ 240, 240 ],
              });
          
              await doc.table(table3, { 
                  columnsSize: [ 240, 240 ],
              });
          
              await doc.table(table4, { 
                  columnsSize: [ 240, 240 ],
              });
          
              await doc.table(table5, { 
                  columnsSize: [ 240, 240 ],
              });
          
              await doc.table(table6, { 
                  columnsSize: [ 240, 240 ],
              });
          
              await doc.table(table7, { 
                  columnsSize: [ 240, 240 ],
              });
          
              await doc.table(table8, { 
                  columnsSize: [ 240, 240 ],
              });
          
              await doc.table(table9, { 
                  columnsSize: [ 240, 240 ],
              });
          
              await doc.table(table10, { 
                  columnsSize: [ 240, 240 ],
              });
          
              await doc.table(table11, { 
                  columnsSize: [ 240, 240 ],
              });
          
              await doc.table(table12, { 
                  columnsSize: [ 160, 160, 160 ],
              });
          
              await doc.table(table13, { 
                  columnsSize: [ 160, 160, 160 ],
              });
          
              await doc.table(table14, { 
                  columnsSize: [ 160, 160, 160 ],
              });

              doc.fontSize(12).font('Helvetica-Bold');
              doc.text('Observaciones:');
              doc.fontSize(8).font('Helvetica');
              doc.text(document.Observaciones)

            if(i < arrayDocuments.length){
                doc.addPage();
            }

            i++;
        }
         doc.end();

  return doc;
}

export {
    buildPDF
}