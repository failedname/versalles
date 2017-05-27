document.addEventListener('DOMContentLoaded',()=>{
  $('#rangeend').calendar({
  type: 'date',
  startCalendar: $('#rangestart'),
  formatter: {
    date: function (date, settings) {
      if (!date) return '';
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();
      return year + '-' + month + '-' + day;
    }
  },
  text: {
      days: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      months: ['Enero', 'Febrero', 'Marzo', 'April', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Novimbre', 'Deciembre'],
      monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      today: 'Hoy',

    },
});
$('#rangestart').calendar({
  type: 'date',
  endCalendar: $('#rangeend'),
  formatter: {
    date: function (date, settings) {
      if (!date) return '';
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();
      return year + '-' + month + '-' + day;
    }
  },
  text: {
      days: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      months: ['Enero', 'Febrero', 'Marzo', 'April', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Novimbre', 'Deciembre'],
      monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      today: 'Hoy',

    },

});
document.getElementById('btn_reportVentas').addEventListener('click', reportVenta)
})

function reportVenta() {
  let start = document.getElementById('fechaStart').value
  let end =   document.getElementById('fechaEnd').value
  let body = document.getElementById('report_body')
  let totivadiv = document.getElementById('totiva')
  let totaldiv= document.getElementById('total')
  let csrftoken = Cookies.get('csrftoken');
  let myHeaders = new Headers({"X-CSRFToken": csrftoken});
  let fechas = {start,end}

  var myInit = {
    method: 'POST',
    body: JSON.stringify(fechas),
    headers: myHeaders,
    credentials: 'include'
  }

  fetch('',myInit)
    .then((response)=>{
      if(!response.length){
        body.innerHTML =`<tr>
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
    })
    .then((data)=>{
      if(!data.data.length){
        body.innerHTML =`<tr>
                          <td colspan="5">
                            <div class="sin_ventas">¡No tienes remisiones en este periodo!</div>
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
          callback: function(result){

              let html = simpleTemplating(result)
              console.log(html)
              body.innerHTML = html
          }
        })
        data.data.map((item)=>{
          total += item.total
          totalIva += item.totaliva

        })
        totivadiv.innerHTML = moneda(totalIva)
        totaldiv.innerHTML = moneda(total)

      }else{


      let html = ''
      let total = 0
      let totalIva = 0

      let result = data.data
      $('#pagging').pagination({
        dataSource: data.data,
        classPrefix: 'item',
        pageSize: 7,
        disableClassName: 'disabled',
        callback: function(result){

            let html = simpleTemplating(result)
            console.log(html)
            body.innerHTML = html
        }
      })
      data.data.map((item)=>{
        total += item.total
        totalIva += item.totaliva

      })
      totivadiv.innerHTML = moneda(totalIva)
      totaldiv.innerHTML = moneda(total)
    }
    })

}


function simpleTemplating (data) {
  let html = ''
  $.each(data, function (index, item) {
    html += `<tr>
              <td class="center aligned">${item.codigo}</td>
              <td>${item.identificacion} -- ${item.nombre}</td>
              <td class="center aligned">${item.fecha}</td>
              <td class="right aligned">${moneda(item.totaliva)}</td>
              <td class="right aligned">${moneda(item.total)}</td>
            </tr>`
  })
  return html
}
