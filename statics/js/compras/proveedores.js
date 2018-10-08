new Vue({
  el: '#app',
  data: {
    text: '',
    client: '',
    producto: '',
    productos: '',
    valuesProduct: '',
    chargeData: {},
    subTotal: '',
    subIva: '',
    total: '',
    info: {
      cliente: {},
      datos: [],
      compra: {
        fecha: '',
        numero: ''
      }
    }
  },
  methods: {
    saveCompra() {
      console.log(this.info)
      if (Object.keys(this.info.cliente).length && this.info.datos.length) {

        let csrftoken = Cookies.get('csrftoken');
        let myHeaders = new Headers({
          "X-CSRFToken": csrftoken
        });
        var myInit = {
          method: 'POST',
          body: JSON.stringify(this.info),
          headers: myHeaders,
          credentials: 'include'
        }
        fetch('save/', myInit).then((res) => {
          if (res.status === 200) {
            this.info.cliente = {}
            this.info.datos = []
            this.info.pago = ''
            this.info.compra.fecha = ''
            this.info.compra.numero = ''


          }
        })
      }
    },
    buscar_pro() {
      if (this.text.length > 3) {
        let csrftoken = Cookies.get('csrftoken');
        let myHeaders = new Headers({
          "X-CSRFToken": csrftoken
        });
        var myInit = {
          method: 'POST',
          body: this.text,
          headers: myHeaders,
          credentials: 'include'
        }
        fetch('proveedor/', myInit).then((res) => {
          return res.json()
        }).then((data) => {
          this.client = data.data

        })

      } else {
        this.client = ''
      }
    },
    selectClient(index) {
      this.info.cliente = this.client[index]
      this.client = ''
      this.text = ''
    },
    buscarProducto() {
      if (this.producto.length > 3) {
        let csrftoken = Cookies.get('csrftoken');
        let myHeaders = new Headers({
          "X-CSRFToken": csrftoken
        });
        var myInit = {
          method: 'POST',
          body: JSON.stringify({
            valinput: this.producto
          }),
          headers: myHeaders,
          credentials: 'include'
        }
        fetch('productos/', myInit).then((res) => {
          return res.json()
        }).then((data) => {
          this.productos = data.data

        })

      } else {
        this.productos = ''

      }
    },
    selectProduct(index) {
      this.valuesProduct = this.productos[index]
      this.valuesProduct['cantidad'] = 1
      this.productos = ''
      this.producto = ''
    },
    charge() {
      this.info.datos.push(this.valuesProduct)
      this.valuesProduct = ''
    },
    deleteRow(index) {
      this.info.datos.splice(index, 1)
    }
  },
  computed: {
    tota() {
      let iva = this.subiva
      let sub = this.subtotal
      return sub + iva
    },
    subiva() {
      let iva = 0
      if (this.info.datos.length) {
        for (var i = 0; i < this.info.datos.length; i++) {
          if (this.info.datos[i].iva == 0) {
            iva += parseInt(this.info.datos[i].iva)
          } else {
            let tot = parseInt(this.info.datos[i].cantidad) * parseInt(this.info.datos[i].precio)
            let real_iva = (parseInt(this.info.datos[i].iva) + 100) / 100
            iva += (tot * real_iva) - tot

          }
        }
      }
      return iva
    },
    subtotal() {
      //     var realIva = (parseInt(iva) + 100) / 100
      //     var TotPro = cantidad * precio
      //     var resIva = TotPro - (TotPro / realIva)
      //     var sinIva = TotPro - resIva
      let sub = 0
      if (this.info.datos.length) {
        for (var i = 0; i < this.info.datos.length; i++) {
          if (this.info.datos[i].iva == 0) {
            sub += parseInt(this.info.datos[i].cantidad) * parseInt(this.info.datos[i].precio)
          } else {
            let realIva = (parseInt(this.info.datos[i].iva) + 100) / 100
            let total = parseInt(this.info.datos[i].cantidad) * parseInt(this.info.datos[i].precio)
            let resIva = total - (total / realIva)

            sub += total

          }
        }
      }
      return sub

    }
  }
})