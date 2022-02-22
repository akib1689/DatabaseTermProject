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

async function getBusByUser(driver_id){
    let sql = `
        SELECT B_ID
        FROM DRIVES
        where DRIVER_ID = :DRIVER_ID AND TO_DATE(OPERATE_DATE, 'YYYY-MM-DD') = TO_DATE(SYSDATE, 'YYYY-MM-DD')
    `;
    let binds = {
        DRIVER_ID : driver_id
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

async function insertDrives(bus_id, driver_id, operation_date){
    let sql = `
        INSERT INTO DRIVES(B_ID, DRIVER_ID, OPERATE_DATE) 
        VALUES (:B_ID, :DRIVER_ID, TO_DATE(:OPERATE_DATE, 'YYYY-MM-DD'))
    `;
    let binds = {
        B_ID : bus_id,
        DRIVER_ID : driver_id,
        OPERATE_DATE : operation_date
    };

    return (await database.execute(sql, binds,database.options));
}

module.exports = {
    insertDriver,
    insertDrives,
    getBusByUser
}