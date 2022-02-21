function get_date() {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let date = now.getDate() + 1;
    if (month.toString().length === 1) {
        month = '0' + month;
    }
    if (date.toString().length === 1) {
        date = '0' + date;
    }
    return year + '-' + month + '-' + date;
}

module.exports = {
   get_date
}