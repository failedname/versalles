document.addEventListener('DOMContentLoaded', () => {
  $('.ui.dropdown').dropdown();
})
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
          label: 'Stock',
          field: 'stock'
        }, {
          label: ''
        }
      ],
      rows: data,
      categoria: categoria,
      presentacion: presentacion,
      id_inventario: '',
      pago: {
        factura: '',
        valor: ''
      },
      index: ''
    }
  },
  methods: {
    showModal() {
      $('#id_nuevo').modal('show');
    },
    showModalAjustes(id) {
      $('#id_ajustes').modal('show');
      this.id_inventario = id
    },
    add_inventario() {
      let form = document.getElementById('form_add')

      let csrftoken = Cookies.get('csrftoken');
      let myHeaders = new Headers({"X-CSRFToken": csrftoken});
      var myInit = {
        method: 'POST',
        body: JSON.stringify({valor: form.add.value, id: this.id_inventario}),
        headers: myHeaders,
        credentials: 'include'
      }
      fetch('add/', myInit).then((res) => {
        return res.json()
      }).then((data) => {
        console.log(data)
        let id = this.rows.findIndex((ele) => {
          return ele.id == data.data.id_producto
        })
        this.rows[id].stock = data.data.stock
        form.reset()
        this.id_inventario = ''
        $('#id_ajustes').modal('hide');
      })

    },
    del_inventario() {
      let form = document.getElementById('form_del')

      let csrftoken = Cookies.get('csrftoken');
      let myHeaders = new Headers({"X-CSRFToken": csrftoken});
      var myInit = {
        method: 'POST',
        body: JSON.stringify({valor: form.del.value, id: this.id_inventario}),
        headers: myHeaders,
        credentials: 'include'
      }
      fetch('del/', myInit).then((res) => {
        return res.json()
      }).then((data) => {
        let id = this.rows.findIndex((ele) => {
          return ele.id == data.data.id_producto
        })
        this.rows[id].stock = data.data.stock
        form.reset()
        this.id_inventario = ''
        $('#id_ajustes').modal('hide');
      })
    },

    save_producto() {

      this.$validator.validateAll().then((result) => {
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

      })

    }
  }
})
