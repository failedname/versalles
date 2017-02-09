


  document.addEventListener('DOMContentLoaded',function() {
    document.getElementById('menuSidebar').addEventListener('click', function () {
      $('.ui.sidebar')
      .sidebar({
        context: $('.bottom.segment')
      })
      .sidebar('toggle', '#menu')
    })
})
