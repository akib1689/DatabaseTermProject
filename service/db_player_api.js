const database = require('./database')

async function getAllLocation(){
    let sql = `
        SELECT 
            *
        FROM
            Location
    `;
    let binds = {};
    return (await database.execute(sql, binds, database.options)).rows;
}

module.exports = {
    getAllLocation
}