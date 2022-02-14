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

async function getRouteByName(name){
    let sql = `
        SELECT 
            *
        FROM
            Route
        WHERE
            NAME = :NAME
    `;
    let binds = {
        NAME : name
    };

    return (await database.execute(sql, binds,database.options)).rows;
}


async function insertRoute(name){
    let sql = `
        INSERT INTO ROUTE (NAME) VALUES (:NAME)
    `;
    let binds = {
        NAME : name
    };

    return (await database.execute(sql, binds,database.options));
}
module.exports = {
    getAllRoute,
    getRouteById,
    getRouteByName,
    insertRoute
}