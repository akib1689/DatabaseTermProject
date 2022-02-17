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

async function insertFare(r_id, l1_id, l2_id, fare){
    let sql = `
        INSERT INTO FARE (R_ID, L1_ID, L2_ID, FARE) VALUES (:R_ID, :L1_ID, :L2_ID, :FARE)
    `;
    let binds = {
        R_ID : r_id,
        L1_ID : l1_id,
        L2_ID : l2_id,
        FARE : fare
    };

    return (await database.execute(sql, binds,database.options));
}

module.exports = {
    getFare,
    insertFare
}