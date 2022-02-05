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



module.exports = {
    getBusInRoute,
    getBusInDate
}