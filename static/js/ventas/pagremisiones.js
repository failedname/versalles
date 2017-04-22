document.addEventListener('DOMContentLoaded', paginar(data))

function paginar (data) {
  $('#pagging').pagination({
    dataSource: data,
    classPrefix: 'item',
    pageSize: 20,
    disableClassName: 'disabled',
    callback: function(data , pagination){
      let html = simpleTemplating(data)
      $('#TableFact').html(html)


    }
  })
}

function simpleTemplating (data) {
  var html = ''
  $.each(data, function (index, item) {
    let estado  = item.estado === 'cerrada' ? `<td class="positive">${item.estado}</td>`: `<td class="negative">${item.estado}</td>`
    let data = moneda(item.total)
    html += `<tr><td>${item.id}</td><td>${item.fecha}</td>
              <td>${item.identificacion}</td>
              <td>${item.nombre}</td><td >${data}</td>
              ${estado}
              <td><a href=""  data-tooltip="Ver" ><i  class="large circular link teal unhide icon"></i></a>

              </td>
            </tr>`
  })
  return html
}

function moneda (number) {
  let dato = new Intl.NumberFormat('es-CO', {style: 'currency', currency: 'USD'}).format(number)
  return dato
}
