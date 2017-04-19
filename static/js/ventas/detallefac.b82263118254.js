document.addEventListener('DOMContentLoaded', detalleFac)

function detalleFac () {
  let action = document.getElementById('action')
  let print = detalle[0].estado === 'cerrada' ? `<a href="#" id="print" data-id="${detalle[0].factura}" data-tooltip="Imprimir Copia" ><i  class="large circular link teal print icon"></i></a>`: null
  action.innerHTML = print
  console.log(print)
  // let generar= document.getElementById('print')
  // console.log(generar)
  //     generar.addEventListener('click', generarPdf)
  let datos = document.getElementById('datos')
  let table = document.getElementById('dattable')
  let html = `<p>Factura: ${detalle[0].factura}</p>
              <p>Cliente: ${detalle[0].cliente}</p>
              <p>Fecha: ${detalle[0].fecha}</p>
              <p>NIT/CC: ${detalle[0].identificacion}</p>
              <p>Dirección: ${detalle[0].direccion}</p>
              <p>Telefono: ${detalle[0].telefono}</p>

              `
let tamaño = detalle.length
var htmlbody = ''
for (var i = 0; i < tamaño; i++) {
  htmlbody  += `<tr>
                <td>${detalle[i].codigo}</td>
                <td>${detalle[i].nombre}</td>
                <td>${moneda(detalle[i].valor)}</td>
                <td>${moneda(detalle[i].iva)}</td>
                <td>${detalle[i].cantidad}</td>
                <td>${moneda(detalle[i].total)}</td>
              </tr>
              `
}
table.innerHTML = htmlbody
datos.innerHTML = html

}
