document.addEventListener('DOMContentLoaded', cargar(data))

function moneda (number) {
  let dato = new Intl.NumberFormat('es-CO', {style: 'currency', currency: 'USD'}).format(number)
  return dato
}
function searchFac (fac) {
  $.ajax({
    url: 'detallefac/',
    type: 'POST',
    data: {'data': fac}
  })
  .done(function (data1) {
    var htmltable = ''
    let modal = document.getElementById('modalContent')
    let table = document.getElementById('tableModal')
    let html = `<div class="ui segments"><div class="ui segment">
                <p>Factura:  ${data1.data[0].factura} </p>
                <p>Cliente:  ${data1.data[0].cliente}</p>
                <p>Nit/CC:  ${data1.data[0].identificacion}</p>
                <p>Direccion:  ${data1.data[0].direccion}</p>
                <p>Telefono:  ${data1.data[0].telefono}</p>
                </div></div>`

    for (var i = 0; i < data1.data.length; i++) {
      let valor = moneda(data1.data[i].valor)
      let total = moneda(data1.data[i].total)
      htmltable += `<tr><td>${data1.data[i].codigo}</td>
                        <td>${data1.data[i].nombre}</td>
                        <td>${valor}</td>
                        <td>${data1.data[i].cantidad}</td>
                        <td>${data1.data[i].iva}</td>
                        <td>${total}</td>
                    </tr>`
    }
    modal.innerHTML = html
    table.innerHTML = htmltable

  })
  .fail(function() {
    console.log("error")
  })
  .always(function() {
    console.log("complete")
  });

}

function cargar (data) {
  $.ajaxSetup({
      beforeSend: function(xhr, settings) {
        if(settings.type == "POST"){
          xhr.setRequestHeader("X-CSRFToken", $('[name="csrfmiddlewaretoken"]').val())
        }
      }
    })

  $('#pagging').pagination({
    dataSource: data,
    classPrefix: 'item',
    pageSize: 20,
    disableClassName: 'disabled',
    callback: function (data, pagination) {
      var html = simpleTemplating(data)
      $('#TableFact').html(html)
      // let body = document.getElementById('TableFact')
      // for (var i = 0; i < body.children.length; i++) {
      //   let aref = body.children[i].querySelector('a')
      //   aref.addEventListener('click', function () {
      //     $('.ui.modal')
      //       .modal('show')
      //     searchFac(this.getAttribute('data-fac'))
      //
      //   })
      // }

    }
  })

  function simpleTemplating (data) {
    var html = ''
    $.each(data, function (index, item) {
      let estado  = item.estado === 'cerrada' ? `<td class="positive">${item.estado}</td>`: `<td class="negative">${item.estado}</td>`
      let data = moneda(item.total)
      html += `<tr><td>${item.codigo}</td><td>${item.fecha}</td>
                <td>${item.identificacion}</td>
                <td>${item.nombre}</td><td >${data}</td>
                ${estado}
                <td><a href="/ventas/facturas/1/detallefac/${item.codigo}"  data-tooltip="Ver" ><i  class="large circular link teal unhide icon"></i></a>

                </td>
              </tr>`
    })
    return html
  }
}