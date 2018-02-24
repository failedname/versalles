document.addEventListener('DOMContentLoaded', () => {
  $('#rangeend').calendar({
    type: 'date',
    startCalendar: $('#rangestart'),
    formatter: {
      date: function(date, settings) {
        if (!date) 
          return '';
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        return year + '-' + month + '-' + day;
      }
    },
    text: {
      days: [
        'D',
        'L',
        'M',
        'M',
        'J',
        'V',
        'S'
      ],
      months: [
        'Enero',
        'Febrero',
        'Marzo',
        'April',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Novimbre',
        'Deciembre'
      ],
      monthsShort: [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic'
      ],
      today: 'Hoy'
    }
  });
  $('#rangestart').calendar({
    type: 'date',
    endCalendar: $('#rangeend'),
    formatter: {
      date: function(date, settings) {
        if (!date) 
          return '';
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        return year + '-' + month + '-' + day;
      }
    },
    text: {
      days: [
        'D',
        'L',
        'M',
        'M',
        'J',
        'V',
        'S'
      ],
      months: [
        'Enero',
        'Febrero',
        'Marzo',
        'April',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Novimbre',
        'Deciembre'
      ],
      monthsShort: [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic'
      ],
      today: 'Hoy'
    }
  });
  document.getElementById('btn_reportVentas').addEventListener('click', reportVenta)
  document.getElementById('exportExcel').addEventListener('click', exportVenta)
})

function exportVenta() {
  let start = document.getElementById('fechaStart').value
  console.log(typeof(start))
  let end = document.getElementById('fechaEnd').value
  window.location.href = `/reportes/ventas/excel/${start}/${end}`
}

function reportVenta() {
  let start = document.getElementById('fechaStart').value
  let end = document.getElementById('fechaEnd').value
  let cate = document.getElementById('cat').value
  let body = document.getElementById('report_body')
  let totivadiv = document.getElementById('totiva')
  let totaldiv = document.getElementById('total')
  let tocompra = document.getElementById('totalcompra')
  let ganancia = document.getElementById('ganancia')
  let csrftoken = Cookies.get('csrftoken');
  let myHeaders = new Headers({"X-CSRFToken": csrftoken});
  let fechas = {
    start,
    end,
    cate
  }

  var myInit = {
    method: 'POST',
    body: JSON.stringify(fechas),
    headers: myHeaders,
    credentials: 'include'
  }

  fetch('', myInit).then((response) => {
    if (!response.length) {
      body.innerHTML = `<tr>
                          <td colspan="5">
                            <div class="sin_ventas">
                              <div class="ui active dimmer">
                                <div class="ui loader"></div>
                              </div>
                            </div>
                          </td>
                        </tr>`
    }
    return response.json()
  }).then((data) => {
    if (!data.data.length) {
      body.innerHTML = `<tr>
                          <td colspan="5">
                            <div class="sin_ventas">¡No tienes ventas en este periodo!</div>
                          </td>
                        </tr>`
      let total = 0
      let totalIva = 0

      let result = data.data
      $('#pagging').pagination({
        dataSource: data.data,
        classPrefix: 'item',
        pageSize: 7,
        disableClassName: 'disabled',
        callback: function(result) {

          let html = simpleTemplating(result)
          body.innerHTML = html
        }
      })
      data.data.map((item) => {
        total += item.total
        totalIva += item.totaliva

      })
      totivadiv.innerHTML = moneda(totalIva)
      totaldiv.innerHTML = moneda(total)

    } else {

      let html = ''
      let total = 0
      let totalIva = 0
      let totcompra = 0

      let result = data.data
      $('#pagging').pagination({
        dataSource: data.data,
        classPrefix: 'item',
        pageSize: 7,
        disableClassName: 'disabled',
        callback: function(result) {

          let html = simpleTemplating(result)
          body.innerHTML = html
        }
      })
      data.data.map((item) => {
        total += item.totalventa
        totalIva += item.iva
        totcompra += item.totalcompra

      })
      totivadiv.innerHTML = `IVA: ${moneda(totalIva)}`
      totaldiv.innerHTML = `Total venta: ${moneda(total)}`
      tocompra.innerHTML = `Total Compra ${moneda(totcompra)}`
      ganancia.innerHTML = `Ganancia ${moneda(total - (totalIva + totcompra))}`

    }
  })

}

function simpleTemplating(data) {
  let html = ''
  console.log(data)
  $.each(data, function(index, item) {

    html += `<tr>

              <td>${item.nombre}</td>
              <td class="center aligned">${item.cantidad}</td>
              <td class="right aligned">${moneda(item.totalventa)}</td>
              <td class="right aligned">${moneda(item.iva)}</td>
              <td class="right aligned">${moneda(item.totalcompra)}</td>
              <td class="right aligned">${moneda((item.totalventa - item.iva) - item.totalcompra)}</td>
            </tr>`
  })
  return html
}
