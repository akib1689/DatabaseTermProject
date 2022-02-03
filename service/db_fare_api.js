const database = require('./database')

async  function getFare(src, des, route){
    let sql = `
        SELECT * 
        FROM fare
        WHERE r_id = :route_id AND ( (l1_id = :src_id AND l2_id = :des_id) OR (l1_id = :des_id AND l2_id = :src_id)) 
    `;
    let binds = {
        route_id : route,
        src_id : src,
        des_id : des
    };
    return (await database.execute(sql, binds, database.options)).rows;
}


module.exports = {
    getFare
}