new Vue({
  el: '#id_proveedores',
  data() {
    return {
      columns: [
        {
          label: 'Nombre'
        }, {
          label: 'NIT'
        }, {
          label: 'Telefono'
        }, {
          label: 'Direccion'
        }
      ],
      rows: ''
    }
  }
})
