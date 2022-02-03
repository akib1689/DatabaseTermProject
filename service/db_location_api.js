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
async function getLocationById(id){
    let sql = `
        SELECT 
            *
        FROM
            LOCATION
        WHERE
            ID = :ID
    `;
    let binds = {
        ID : id
    };


    return (await database.execute(sql, binds,database.options)).rows;
}

module.exports = {
    getAllLocation,
    getLocationById
}