export function formatRate(rate) {
    let number = Number(rate)
    return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}
