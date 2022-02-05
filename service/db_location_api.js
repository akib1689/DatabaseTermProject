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


async function getLocationByName(name) {
    let sql = `
        SELECT *
        FROM LOCATION
        WHERE
            NAME = :loc_name
    `;
    let binds = {
        loc_name : name
    };

    return (await database.execute(sql, binds,database.options)).rows;
}
async function insertLocation(name){
    let sql = `
        INSERT INTO LOCATION (NAME) VALUES (:NAME)
    `;
    let binds = {
        NAME : name
    };

    return (await database.execute(sql, binds,database.options));
}
module.exports = {
    getAllLocation,
    getLocationById,
    getLocationByName,
    insertLocation
}