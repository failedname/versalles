function moneda (number) {
  let dato = new Intl.NumberFormat('es-CO', {style: 'currency', currency: 'USD'}).format(number)
  return dato
}
