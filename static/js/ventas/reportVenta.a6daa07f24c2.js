document.addEventListener('DOMContentLoaded',()=>{
  $('#rangeend').calendar({
  type: 'date',
  startCalendar: $('#rangestart'),
  text: {
      days: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      months: ['Enero', 'Febrero', 'Marzo', 'April', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Novimbre', 'Deciembre'],
      monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      today: 'Hoy',

    },
});
$('#rangestart').calendar({
  type: 'date',
  endCalendar: $('#rangeend'),
  text: {
      days: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      months: ['Enero', 'Febrero', 'Marzo', 'April', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Novimbre', 'Deciembre'],
      monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      today: 'Hoy',

    },
});
document.getElementById('btn_reportVentas').addEventListener('click', reportVenta)
})

function reportVenta() {
  alert('hola')
}
