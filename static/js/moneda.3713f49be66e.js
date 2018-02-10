function moneda(number) {
  let dato = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(number)
  return dato
}
