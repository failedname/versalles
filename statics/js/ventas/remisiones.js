document.addEventListener('DOMContentLoaded', function () {
  $.ajaxSetup({
  		beforeSend: function(xhr, settings) {
  			if(settings.type == "POST"){
  				xhr.setRequestHeader("X-CSRFToken", $('[name="csrfmiddlewaretoken"]').val())
  			}
  		}
  	})
    document.getElementById('search-cliente').addEventListener('keyup', buscarCliente)
})


function buscarCliente () {
  let valInput = document.getElementById('cliente_search').value
  var classResult = document.getElementById('result')
  var html = ''
  $.ajax({
    url: 'cliente/',
    type: 'POST',
    data: {data: valInput}
  })
  .done(function (data) {
    if(!data.error) {
      for(let i = 0, len = data.data.length; i < len; i++ ){
        html += `<a data-id="${data.data[i].id}"
                   data-nombre="${data.data[i].nombre}" data-precio="" class="result" >
                  <div class="content">
                    <div class="title">${data.data[i].nombre}</div>
                    <div class="description">${data.data[i].cc}</div>
                  </div>
                </a>`
      }
      classResult.className = 'results transition visible'
      classResult.innerHTML = html
    }else{
      classResult.className = 'results transition hidden'
    }
  })
}
