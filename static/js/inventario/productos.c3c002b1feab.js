document.addEventListener('DOMContentLoaded', cargar)

function cargar () {
  console.log(productos)
  $('#tablePro').DataTable({
    data: productos,
    columns: [
            { 'data': 'nombre' },
            { 'data': 'precio' },
            { 'data': 'iva' },
            { 'data': 'categoria' },
            { 'data': 'presentacion' },
            { 'data': 'vivero' },
            { 'data': 'stock' }

        ],
    "language": {
                "lengthMenu": "Mostrar _MENU_ productos por pagina",
                "zeroRecords": "No hay registros",
                "info": "Pagina _PAGE_ de _PAGES_",
                "infoEmpty": "No hay productos",
                "infoFiltered": "(Filtrado de 3 registros totales)",
                "search": "Buscar:  ",
                'oPaginatesNext': 'Siguiente',
                'oPaginate': {
                  'sNext': 'Siguiente',
                  'sPrevious': 'Anterior'
                }
      }

  })
}
