const database = require('./database')

// get today's bus of a route
async  function getBusInRoute(route){
    let sql = `
        SELECT B_ID, TO_CHAR(OPERATE_DATE) OPERATE_DATE
        FROM operates
        where r_id = :route_id and TO_CHAR(OPERATE_DATE) = TO_CHAR(SYSDATE)
    `;
    let binds = {
        route_id : route
    };
    return (await database.execute(sql, binds, database.options)).rows;
}

async  function getBusInDate(route, date){
    let sql = `
        SELECT B_ID, TO_CHAR(OPERATE_DATE) OPERATE_DATE
        FROM operates
        where r_id = :route_id and TO_CHAR(OPERATE_DATE) = TO_CHAR(:operate_date)
    `;
    let binds = {
        route_id : route,
        operate_date : date
    };
    return (await database.execute(sql, binds, database.options)).rows;
}

async function insertOperation(bus_id, route_id , operation_date, offset){
    let sql = `
        INSERT INTO OPERATES(B_ID, R_ID, OPERATE_DATE) 
        VALUES (:B_ID, :R_ID, TO_DATE(:OPERATE_DATE, 'YYYY-MM-DD')+ :OFFSET)
    `;
    let binds = {
        B_ID : bus_id,
        R_ID : route_id,
        OPERATE_DATE : operation_date,
        OFFSET: offset
    };

    return (await database.execute(sql, binds,database.options));
}

module.exports = {
    getBusInRoute,
    getBusInDate,
    insertOperation
}