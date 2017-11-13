new Vue({
  el:'#id_facturas',
  data(){
    return {
      columns:[
        {
          label: 'Factura',
          field: 'codigo'
        },
        {
          label: 'Creación'
        },
        {
          label:'Vencimiento'
        },
        {
          label:'Cliente',
          filterable: true
        },
        {
          label:'Nombre',
          filterable:true
        },
        {
          label:'total'
        },
        {
          label:'Pagado'
        },
        {
          label:'Por Pagar'
        },
        {
          label:'Estado'
        },
        {
          label:'Acciones'
        }
      ],
      rows: data
    }
  },
  component:{
    VueGoodTable:VueGoodTable
  }
})