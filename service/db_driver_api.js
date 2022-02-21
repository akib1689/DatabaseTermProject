const database = require('./database')
const oracledb = require("oracledb");

async  function getBus(id){
    let sql = `
        SELECT * 
        FROM BUS
        WHERE  ID = :id
    `;
    let binds = {
        id : id
    };
    return (await database.execute(sql, binds, database.options)).rows;
}

async  function getBusDynamicStatus(id){
    let sql = `
        SELECT * 
        FROM BUS_DYNAMIC_STATUS
        WHERE  B_ID = :id
    `;
    let binds = {
        id : id
    };
    return (await database.execute(sql, binds, database.options)).rows;
}

async function insertDriver(p_id, licence){
    let sql = `
       INSERT INTO DRIVER (P_ID, DRIVING_LICENCE_NUMBER)
       VALUES(:P_ID, :DRIVING_LICENCE_NUMBER)
    `;

    let binds = {
        P_ID : p_id,
        DRIVING_LICENCE_NUMBER : licence
    };

    return (await database.execute(sql, binds,database.options));
}

async function insertRequest(bus_id, driver_id, operate_date, offset){
    let sql = `
       INSERT INTO REQUESTED (B_ID, DRIVER_ID, OPERATE_DATE)
       VALUES(:B_ID, :DRIVER_ID, (TO_DATE(:OPERATE_DATE, 'YYYY-MM-DD')+ :OFFSET))
    `;

    let binds = {
        B_ID : bus_id,
        DRIVER_ID : driver_id,
        OPERATE_DATE: operate_date,
        OFFSET: offset
    };

    return (await database.execute(sql, binds,database.options));
}

module.exports = {
    insertDriver,
    insertRequest
}