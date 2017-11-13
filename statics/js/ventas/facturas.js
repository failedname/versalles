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
          label:'Cliente',
          field: 'identificacion',
          filterable: true
        },
        {
          label:'Nombre',
          field:'nombre',
          filterable:true
        },
        {
          label:'total'
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