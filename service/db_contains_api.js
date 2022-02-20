const database = require('./database')

async function getAllLocationByRoute(id) {
    let sql = `
        SELECT 
            L_ID
        FROM
            CONTAINS
        WHERE
            R_ID = :ID
    `;
    let binds = {
        ID: id
    };
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getAllRoutesByLocation(id) {
    let sql = `
        SELECT 
            R_ID
        FROM
            CONTAINS
        WHERE
            L_ID = :ID
    `;
    let binds = {
        ID: id
    };
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getAllDestinationByLocation(id) {
    let sql = `
        SELECT c2.r_id, c2.l_id
        FROM contains c1 JOIN contains c2
        ON c1.r_id = c2.r_id
        WHERE c1.l_id = :id AND (c1.l_id <> c2.l_id)
    `;
    let binds = {
        id: id
    };
    return (await database.execute(sql, binds, database.options)).rows;
}

async function insertInContains(r_id, l_id){
    let sql = `
        INSERT INTO CONTAINS (R_ID, L_ID) VALUES (:R_ID, :L_ID)
    `;
    let binds = {
        R_ID : r_id,
        L_ID : l_id
    };

    return (await database.execute(sql, binds,database.options));
}

module.exports = {
    getAllLocationByRoute,
    getAllRoutesByLocation,
    getAllDestinationByLocation,
    insertInContains
}