const database = require('./database')

async  function getAllCompany(){
    let sql = `
        SELECT * 
        FROM COMPANY
    `;
    let binds = {};
    return (await database.execute(sql, binds, database.options)).rows;
}


module.exports = {
    getAllCompany
}