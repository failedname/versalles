
document.addEventListener("DOMContentLoaded", function () {
  $.ajaxSetup({
  		beforeSend: function(xhr, settings) {
  			if(settings.type == "POST"){
  				xhr.setRequestHeader("X-CSRFToken", $('[name="csrfmiddlewaretoken"]').val())
  			}
  		}
  	})


    $('#search-pro')
    .search({
      source: proveedores,
      fields: {
        title: 'nombre',
        price: 'cc'

      },
      searchFields: [
        'cc',
        'nombre'



      ],
      searchFullText: false,
      onSelect: function (result, response) {
        document.getElementById('iden').value = result.cc
        document.getElementById('nombre').value = result.nombre
      }

    })
    $('#producto_search')
    .search({
      apiSettings:{
        url:'productos/{query}/'

      },
      fields:{
        results:'data',
        title: 'nombre',
        price:'precio',
        description:'pres'

      },
      searchFields:[
        'nombre',
      ],
      error:{
        noResults:'No hay resultados'
      },
      cache:false,
      onSelect: function(results,res){
        document.getElementById('id_codigo').value=results.id
        document.getElementById('id_producto').value=results.nombre
        document.getElementById('id_iva').value=results.iva
        document.getElementById('id_precio').focus()
      }
    })

    let origin = {
      data: {
        factura: '',
        fecha: '',
        proveedor: '',
        data: []
      }
    }
    let factura = {
      data: {
        factura: '',
        fecha: '',
        proveedor: '',
        data: []
      },
      agregar (fact, fecha, prove, produ, nompro, iva, precio, cantidad, desc, neto) {

        this.data.factura = fact
        this.data.fecha = fecha
        this.data.proveedor = prove
        this.data.data.push({produ, nompro, iva, precio, cantidad, desc, neto})
        console.log(this.data)

      },
      borrar (id) {
        this.data.data.splice(id, 1)

      }
    }

    document.getElementById('btnAgregar').addEventListener('click', agregar)

    function agregar (e) {
      e.preventDefault()
      let fact = document.getElementById('factura_id').value
      let fecha = document.getElementById('fecha').value
      let prov = document.getElementById('iden').value
      let prod = document.getElementById('id_codigo').value
      let nompro = document.getElementById('id_producto').value
      let iva = document.getElementById('id_iva').value
      let precio = document.getElementById('id_precio').value
      let cantidad = document.getElementById('id_cantidad').value
      let descuento = document.getElementById('id_descuento').value
      let valIva = (parseInt(iva) + 100) / 100
      let Tot = precio * cantidad
      let TotIva = Tot - (Tot / valIva)
      let TotSinIva = Tot - TotIva
      let descuen = TotSinIva * (descuento / 100)
      let neto = (TotSinIva - descuen) + TotIva
      factura.agregar(fact, fecha, prov, prod, nompro, TotIva, precio, cantidad, descuen, neto)
      render()
    }

    function render () {
      let body = document.getElementById('bodyTable')
      let desc = document.getElementById('id_desc')
      let iva = document.getElementById('id_iv')
      let tot = document.getElementById('id_tot')
      let sub = document.getElementById('id_sub')
      let tr = document.createElement('tr')
      let arr = factura.data.data
      var totDesc = 0
      var totIva = 0
      var totPro = 0
      for (var i = 0, lon = arr.length; i < lon; i++) {
        let row = `<td>${arr[i].produ}</td>
                   <td>${arr[i].nompro}</td>
                   <td>${arr[i].precio}</td>
                   <td>${arr[i].iva}</td>
                   <td>${arr[i].desc}</td>
                   <td>${arr[i].cantidad}</td>
                   <td>
                      <button key="${i}" class="ui icon button">
                        <i class="remove icon"></i>
                      </button>
                  </td>

                        `
        totDesc += arr[i].desc
        totIva += arr[i].iva
        totPro += arr[i].precio * arr[i].cantidad
        tr.innerHTML = row
        tr.querySelector('button').addEventListener('click', borrarRow)
      }
      desc.value = Math.round(totDesc)
      iva.value = Math.round(totIva)
      sub.value = Math.round((totPro - totIva) - totDesc)
      tot.value = Math.round(((totPro - totIva) - totDesc) + totIva)
      body.appendChild(tr)
      reset()


    }

    function borrarRow () {
        factura.borrar(parseInt(this.getAttribute('key')))
        console.log(factura.data)
        document.getElementById('bodyTable').innerHTML = ''
        render()

      }



    function reset () {
      document.getElementById('id_codigo').value = ''
      document.getElementById('id_producto').value = ''
      document.getElementById('id_iva').value = ''
      document.getElementById('id_precio').value = ''
      document.getElementById('id_cantidad').value = ''
      document.getElementById('id_descuento').value = ''
    }

document.getElementById('id_saveCompra').addEventListener('click', saveCompra)
 function saveCompra () {
    let datos = JSON.stringify(factura.data)
    $.ajax({
      url:'save_compra/',
      data:datos,
      type:'POST',
    })
    .done(function (data) {
      resetAll()


    })
    .fail(function () {})
 }

 function resetAll () {
   factura.data = origin.data
   document.getElementById('bodyTable').innerHTML = ''
   document.getElementById('id_desc').value = ''
   document.getElementById('id_iv').value = ''
   document.getElementById('id_tot').value = ''
   document.getElementById('id_sub').value = ''
   document.getElementById('pro_search').value = ''
   document.getElementById('cliente_search').value = ''
   document.getElementById('iden').value = ''
   document.getElementById('nombre').value = ''
   document.getElementById('factura_id').value = ''
   document.getElementById('fecha').value = ''
 }


})
