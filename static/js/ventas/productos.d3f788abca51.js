document.addEventListener('DOMContentLoaded',function () {
  $.ajaxSetup({
  		beforeSend: function(xhr, settings) {
  			if(settings.type == "POST"){
  				xhr.setRequestHeader("X-CSRFToken", $('[name="csrfmiddlewaretoken"]').val())
  			}
  		}
  	})
var idbtn = document.getElementById('pdfProductos').addEventListener('click', generarPdf)

})



function generarPdf () {
  let array = []
  let len = data.length
  for(let i = 0; i< len; i++){
    array.push([data[i].nombre,
                data[i].presentacion,
                moneda(data[i].precioventa),
                moneda(data[i].precioxmayor)]

              )
  }
  
  pdfProductos(array)

}

function pdfProductos (rows) {
  var doc = new jsPDF('A4')
  let columns = ['Nombre', 'Presentacion', 'Precio Venta', 'Precio x Mayor']
  doc.autoTable(columns, rows,{theme: 'grid', headerStyles:{
    fontSize: 7
  },
  styles: {
    fontSize: 7
  }
})
  doc.output('dataurlnewwindow')
}
