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
      selected:'',
      rows: data,
      cate: categoria,

      presentacion: presentacion,
      id_inventario: '',
      pago: {
        factura: '',
        valor: ''
      },
      index: ''
    }
  },
  mounted(){
    $('.ui.dropdown').dropdown();
  },
  methods: {
    printPro(){
      let csrftoken = Cookies.get('csrftoken');
      let myHeaders = new Headers({"X-CSRFToken": csrftoken});
      var myInit = {
        method: 'POST',
        body:JSON.stringify({id:this.selected}),
        headers: myHeaders,
        credentials: 'include'
      }
      fetch('print/', myInit).then((res) => {
        return res.json()
      }).then((data) => {
        let rows = []
        let len = data.data.length
        for(let i = 0; i< len; i++){
          rows.push([data.data[i].nombre,
                      data.data[i].presentacion,
                      moneda(data.data[i].precioventa),
                      moneda(data.data[i].precioxmayor)]

                    )
        }
        var doc = new jsPDF('A4')
        let columns = ['Nombre', 'Presentacion', 'Precio Venta', 'Precio x Mayor']
        doc.autoTable(columns, rows,{theme: 'grid', headerStyles:{
          fontSize: 7
        },
        styles: {
          fontSize: 7
        }
        })
        doc.autoPrint();

        window.open(doc.output('bloburl'), '_blank');      })
    },
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
