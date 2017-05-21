document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('buscarProductos').addEventListener('input', buscarProducto)
  document.getElementById('btnSave').addEventListener('click', saveVenta)
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
let items = []
function select(ele) {
  let item = items.filter((elem)=>{
    return elem.id === ele.dataset.key
  })

  if(item.length === 0){
    items.push(
      {
        id: ele.dataset.key,
        name: ele.dataset.name,
        iva: ele.dataset.iva,
        precio: ele.dataset.precio,
        cantidad: 1
      }
    )
    reRender(items)
  }else{
    item[0].cantidad = item[0].cantidad + 1
    reRender(items)
  }

}


function reRender(itemVenta){
  let rowItem = ''
  let total = document.getElementById('total')
  let divSub = document.getElementById('subTotal')
  let divIva = document.getElementById('subIva')
  let divItems = document.getElementById('itemVenta')
  let btnSave = document.getElementById('btnSave')
  items.length > 0 ? btnSave.removeAttribute('disabled'):btnSave.setAttribute('disabled',true)

  let tot = 0
  let subTotal = 0
  let totIva = 0
  itemVenta.map((row)=>{
    let totRow = row.cantidad * parseInt(row.precio)
    let ivaRow = (parseInt(row.iva)+100)/100

    let sinIva = totRow - (totRow/ivaRow)
    totIva += sinIva
    subTotal += totRow - sinIva

    rowItem += `

              <div data-key="${row.id}" onclick="ola()">
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
  let newRow = items.filter((row)=>{
    return row.id !== ele.parentNode.parentNode.parentNode.dataset.key
  })

  items = []
  items = newRow
  reRender(items)
}

function ola(e){
  alert('hola')
}

function saveVenta(){
  alert('hola')
}
