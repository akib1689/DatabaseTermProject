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
        SELECT DISTINCT c2.l_id
        FROM contains c1 JOIN contains c2
        ON c1.r_id = c2.r_id
        WHERE c1.l_id = :id AND (c1.l_id <> c2.l_id)
    `;
    let binds = {
        id: id
    };
    return (await database.execute(sql, binds, database.options)).rows;
}

module.exports = {
    getAllLocationByRoute,
    getAllRoutesByLocation,
    getAllDestinationByLocation
}