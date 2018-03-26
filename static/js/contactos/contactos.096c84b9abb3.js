new Vue({
  el: '#id_contactos',
  delimiters: [
    '[[', ']]'
  ],
  data() {
    return {
      columns: [
        {
          label: 'Nombre',
          field: 'nombre',
          filterable: true
        }, {
          label: 'NIT',
          field: 'nit',
          filterable: true
        }, {
          label: 'Telefono'
        }, {
          label: 'Direccion'
        }, {
          label: ''
        }
      ],
      rows: []
    }
  },
  mounted() {
    let csrftoken = Cookies.get('csrftoken');
    let myHeaders = new Headers({"X-CSRFToken": csrftoken});
    var myInit = {
      method: 'POST',
      headers: myHeaders,
      credentials: 'include'
    }
    fetch('', myInit).then((res) => {
      return res.json()
    }).then((data) => {
      this.rows = data.data
    })
  }
})
