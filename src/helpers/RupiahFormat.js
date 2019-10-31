const RupiahFormat = (price, fixed = 2) => {
  // const priceSplit = String(price.toFixed(fixed)).split('.')
  // const firstPrice = priceSplit[0]
  // const secondPrice = priceSplit[1]
  // const priceReal = String(firstPrice).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  // if (Number(secondPrice) > 0) {
  //   return `${priceReal},${secondPrice}`
  // } else {
  //   return `${priceReal}`
  // }
  let numberString = price.toString()
  let split = numberString.split(',')
  let sisa = split[0].length % 3
  let rupiah = split[0].substr(0, sisa)
  let ribuan = split[0].substr(sisa).match(/\d{1,3}/gi)

  if (ribuan) {
    let separator = sisa ? '.' : ''
    rupiah += separator + ribuan.join('.')
  }
  rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah
  return rupiah
}
export default RupiahFormat
