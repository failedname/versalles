Vue.use(VeeValidate)
new Vue({
  el: '#table_productos',
  delimiters: [
    '[[', ']]'
  ],
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
          label: ''
        }
      ],
      rows: data,
      categoria: categoria,
      presentacion: presentacion,
      pago: {
        factura: '',
        valor: ''
      },
      index: ''
    }
  },
  methods: {
    showModal() {
      $('.ui.modal').modal('show');
    },
    save_producto() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          let form = document.getElementById('form-producto')
          let data = new FormData(form)
          let csrftoken = Cookies.get('csrftoken');
          let myHeaders = new Headers({"X-CSRFToken": csrftoken});
          var myInit = {
            method: 'POST',
            body: data,
            headers: myHeaders,
            credentials: 'include'
          }
          fetch('save_producto/', myInit).then((res) => {
            return res.json()
          }).then((data) => {
            this.rows.push(data.res[0])
            form.reset()
            $('.ui.modal').modal('hide');
          })

        }

      })

    }
  }
})
