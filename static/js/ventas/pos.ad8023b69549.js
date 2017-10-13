document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('buscarProductos').addEventListener('input', buscarProducto)
  document.getElementById('btnSave').addEventListener('click', saveVenta)
  document.getElementById('invoice__cancel').addEventListener('click', deleteFactura)
  document.getElementById('buscarCliente').addEventListener('input',buscarCliente)
  document.getElementById('cancelModal').addEventListener('click',()=>{
    $('.ui.modal.otro')
    .modal('hide')
  })
  document.getElementById('saveModal').addEventListener('click',(e)=>{
    
    let index = parseInt(e.target.dataset.index)
    
    items.venta[index].precio = precioModal.value
    items.venta[index].cantidad = parseInt(cantidadModal.value)
    reRender(items.venta)
    
    $('.ui.modal.otro')
    .modal('hide')
  })

;
})


function buscarProducto() {
  let csrftoken = Cookies.get('csrftoken');
  let myHeaders = new Headers({"X-CSRFToken": csrftoken});

  var myInit = {
    method: 'POST',
    body: this.value,
    headers: myHeaders,
    credentials: 'include'
  }
  fetch('productopos/', myInit).then((response) => {
    return response.json()
  }).then((data) => {
    render(data.data)
  })

}

function render(data) {
  let htmlItems = []
  let divItems = document.getElementById('items')
  data.map((item) => {
    htmlItems.push(`<div  class="eight wide column">
                      <div
                        data-key="${item.id}"
                        data-name="${item.nombre}"
                        data-iva="${item.iva}"
                        data-precio="${item.precio}"
                        data-presentacion="${item.presentacion}"

                       onclick="select(this)" class="ui link cards">
                      <div  class="ui card">
                        <div class="content">
                          <div class="header header-card">${item.nombre.toUpperCase()}</div>
                          <div class="meta color-desc">${item.presentacion}</div>
                          <div class="description color-price">
                           ${moneda(item.precio)}
                          </div>
                        </div>
                      </div>
                      </div>
                    </div>`)
  })
  divItems.innerHTML = htmlItems.join("")

}
let items = {
  cliente: {},
  venta: []
}
function select(ele) {
  let item = items.venta.filter((elem)=>{
    return elem.id === ele.dataset.key
  })

  if(item.length === 0){
    items.venta.push(
      {
        id: ele.dataset.key,
        name: ele.dataset.name,
        iva: ele.dataset.iva,
        precio: ele.dataset.precio,
        cantidad: 1,
      }
    )
    reRender(items.venta)
  }else{
    item[0].cantidad = item[0].cantidad + 1
    reRender(items.venta)
  }

}


function reRender(itemVenta){
  console.log(items)
  let rowItem = ''
  let total = document.getElementById('total')
  let divSub = document.getElementById('subTotal')
  let divIva = document.getElementById('subIva')
  let divItems = document.getElementById('itemVenta')
  let btnSave = document.getElementById('btnSave')
  items.venta.length > 0 ? btnSave.removeAttribute('disabled'):btnSave.setAttribute('disabled',true)

  let subTotal = 0
  let totIva = 0
  itemVenta.map((row)=>{
    let totRow = parseInt(row.cantidad) * parseInt(row.precio)
    let ivaRow = (parseInt(row.iva)+100)/100

    let sinIva = totRow - (totRow/ivaRow)
    totIva += sinIva
    subTotal += totRow - sinIva

    rowItem += `

              <div data-key="${row.id}" onclick="rowPro(this)">
                <div class="invoice-item">
                  <div class="invoice-item__container">
                    <div class="invoice-item__data">
                      <p class="invoice-item__name">${row.name.toUpperCase()}</p>
                      <div>
                        <p>$${row.precio}</p>
                      </div>
                    </div>
                    <div class="invoice-item__quantity">
                      <p class="ui big teal circular label">${row.cantidad}</p>
                    </div>
                      <p class="invoice-item__total">$${parseInt(row.precio) * row.cantidad}</p>
                    <button class="ui circular icon button" onclick="deleteRow(this,event)">
                      <i class="big trash red icon"></i>
                    </button>
                  </div>
                </div>
              </div>

                `
  })
  divItems.innerHTML = rowItem
  divSub.innerHTML = moneda(Math.round(subTotal))
  divIva.innerHTML =  moneda(Math.round(totIva))
  total.innerHTML = moneda(subTotal + totIva)


}


function deleteRow(ele,e){
  e.stopPropagation()
  let newRow = items.venta.filter((row)=>{
    return row.id !== ele.parentNode.parentNode.parentNode.dataset.key
  })

  items.venta = []
  items.venta = newRow
  reRender(items.venta)
}

function deleteFactura(){
  items.cleinte = {}
  items.venta = []
  reRender(items.venta)
}


function buscarCliente(){
  let csrftoken = Cookies.get('csrftoken');
  let myHeaders = new Headers({"X-CSRFToken": csrftoken});
  let divResult = document.getElementById('clienteResult')
  if(this.value.length === 0){
    items.cliente = {}
    divResult.className= 'results transition hiden'
  }else{
    var myInit = {
      method: 'POST',
      body: this.value,
      headers: myHeaders,
      credentials: 'include'
    }

    fetch('clientepos/',myInit)
      .then((response)=>{
        return response.json()
      })
      .then((data)=>{
        divResult.className= 'results transition visible'
        let html = ''

        data.data.map((item)=>{
          html += `<a data-id="${item.id}" data-nombre="${item.nombre}" onclick="selectCliente(this)">
                    <div class="result">
                      <div class="title">${item.nombre}</div>
                      <div class="description">${item.iden}</div>
                    </div>
                  </a>`
        })
        divResult.innerHTML = html
      })
  }


}

function selectCliente(ele){
  let divResult = document.getElementById('clienteResult')
  let inputCliente = document.getElementById('buscarCliente')
      divResult.className = 'results transition hidden'

  items.cliente = {id: ele.dataset.id}
  inputCliente.value = ele.dataset.nombre

}

function rowPro(e){
  let modalHeader = document.getElementById('modalHeader')
  let precioModal = document.getElementById('precioModal')
  let cantidadModal = document.getElementById('cantidadModal')
  let botonSave = document.getElementById('saveModal')
  let index = items.venta.findIndex((item)=>{
    return item.id === e.dataset.key
  })
  modalHeader.innerHTML = items.venta[index].name
  precioModal.value = items.venta[index].precio
  cantidadModal.value = items.venta[index].cantidad
  botonSave.setAttribute('data-index',index)

  $('.ui.modal.otro')
  .modal('show')
}


function saveVenta(){
  let inputCliente = document.getElementById('buscarCliente')
  let csrftoken = Cookies.get('csrftoken');
  let myHeaders = new Headers({"X-CSRFToken": csrftoken});
  console.log(items)
  var myInit = {
    method: 'POST',
    body: JSON.stringify(items),
    headers: myHeaders,
    credentials: 'include'
  }

  fetch('save/',myInit)
    .then((response)=>{
       return response.json()
    })
    .then((data)=>{
      items.cliente = {}
      items.venta= []
      inputCliente.value = ''
      reRender(items.venta)
    })

}
