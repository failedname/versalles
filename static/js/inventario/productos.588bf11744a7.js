new Vue({
  el: '#table_productos',
  components: {
    'barcode': VueBarcode
  },
  delimiters: [
    '[[', ']]'
  ],
  data() {
    return {
      columns: [
        {
          label: 'Codigo',
          field: 'id'
        }, {
          label: 'Barras'
        }, {
          label: 'Nombre',
          field: 'nombre',
          filterable: true
        }, {
          label: 'Categoria',
          field: 'categoria'
        }, {
          label: 'IVA'
        }, {
          label: 'Presentación',
          field: 'presentacion'
        }, {
          label: 'Precio'
        }, {
          label: 'Pagado'
        }, {
          label: 'Por Pagar'
        }, {
          label: 'Estado'
        }, {
          label: ''
        }
      ],
      rows: data,
      pago: {
        factura: '',
        valor: ''
      },
      index: ''
    }
  }
})
