new Vue({
  el: '#id_facturas',
  data() {
    return {
      columns: [
        {
          label: 'Factura',
          field: 'codigo'
        }, {
          label: 'Creación'
        }, {
          label: 'Cliente',
          field: 'identificacion',
          filterable: true
        }, {
          label: 'Nombre',
          field: 'nombre',
          filterable: true
        }, {
          label: 'total'
        }, {
          label: 'Pagado'
        }, {
          label: 'Por Pagar'
        }, {
          label: 'Estado'
        }, {
          label: 'Acciones'
        }
      ],
      rows: data,
      pago: {
        factura: '',
        valor: ''
      }
    }
  },
  methods: {
    modalPago(index) {
      this.pago.factura = index
      $('.ui.modal').modal('show')
    },
    savePago() {
      let csrftoken = Cookies.get('csrftoken');
      let myHeaders = new Headers({"X-CSRFToken": csrftoken});
      var myInit = {
        method: 'POST',
        body: JSON.stringify({factura: this.pago.factura, pago: this.pago.valor}),
        headers: myHeaders,
        credentials: 'include'
      }
      fetch('pago/', myInit).then((res) => {
        return res.json()
      }).then((data) => {

        let indexFac = this.rows.findIndex((element) => {
          return element.codigo == this.pago.factura
        })
        this.rows[indexFac].abonos = data.factura[0].abonos
        this.rows[indexFac].estado = data.factura[0].estado
        this.pago.factura = ''
        this.pago.valor = ''

      })
    }
  },
  component: {
    VueGoodTable: VueGoodTable
  }
})
