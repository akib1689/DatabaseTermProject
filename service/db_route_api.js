const database = require('./database')

async function getAllRoute(){
    let sql = `
        SELECT 
            *
        FROM
            Route
    `;
    let binds = {};
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getRouteById(id){
    let sql = `
        SELECT 
            *
        FROM
            Route
        WHERE
            ID = :ID
    `;
    let binds = {
        ID : id
    };

    return (await database.execute(sql, binds,database.options)).rows;
}

module.exports = {
    getAllRoute,
    getRouteById
}