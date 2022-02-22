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

async  function getSrcDesFare(src, des){
    let sql = `
        SELECT * 
        FROM fare
        WHERE ((l1_id = :src_id AND l2_id = :des_id) OR (l1_id = :des_id AND l2_id = :src_id)) 
    `;
    let binds = {
        src_id : src,
        des_id : des
    };
    return (await database.execute(sql, binds, database.options)).rows;
}
async function getRouteFare(route_id){
    let sql = `
        SELECT f.l1_id loc_1, l1.name loc_1_name, f.l2_id loc_2, l2.name loc_2_name, f.fare fare
        FROM fare f JOIN location l1 ON (f.l1_id = l1.id) JOIN location l2 ON (f.l2_id = l2.id)
        WHERE f.r_id = :route_id
        ORDER BY f.l1_id DESC, f.l2_id
`;
    let binds = {
        route_id : route_id
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

async function updateFare(route_id, src_id, des_id, fare){
    let sql = `
        UPDATE FARE F
        SET FARE = :FARE
        WHERE F.R_ID = :R_ID AND ((F.L1_ID = :L1_ID AND F.L2_ID = :L2_ID) OR (F.L1_ID = :L2_ID AND F.L2_ID = :L1_ID)) 
    `;
    let binds = {
        R_ID : route_id,
        L1_ID : src_id,
        L2_ID : des_id,
        FARE : fare
    };

    return (await database.execute(sql, binds,database.options));
}



module.exports = {
    getFare,
    getSrcDesFare,
    getRouteFare,
    insertFare,
    updateFare
}