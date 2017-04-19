
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('btnAgregar').addEventListener('click', function (e) {
    e.preventDefault()
    $('.ui.form')
      .form({
        on: 'blur',
        fields: {
          ident: {
            identifier: 'ident',
            rules: [
              {
                type: 'empty',
                prompt: 'Please enter a value'
              }
            ]
          }
        }

      })
  })
})
