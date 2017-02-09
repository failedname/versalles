document.addEventListener('DOMContentLoaded', detalleFac)

function detalleFac () {
  let datos = document.getElementById('datos')
  let table = document.getElementById('dattable')
  let html = `<p>Factura: ${detalle[0].factura}</p>
              <p>Cliente: ${detalle[0].cliente}</p>
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
                <td>${detalle[i].valor}</td>
                <td>${detalle[i].iva}</td>
                <td>${detalle[i].cantidad}</td>
                <td>${detalle[i].total}</td>
              </tr>
              `
}
table.innerHTML = htmlbody
datos.innerHTML = html

}
