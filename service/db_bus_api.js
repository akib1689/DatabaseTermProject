const database = require('./database')

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

async function getBusNotAssignedToday(){
    let sql =
        `SELECT TD.ID, TD.LICENCE_PLATE_NUMBER, TD.CAPACITY, TD.COMPANY_ID, O.R_ID, O.OPERATE_DATE, R.NAME, ROUND((TD.CAPACITY * (SELECT AVG(FARE)
                                                                                                                                    FROM FARE 
                                                                                                                                    WHERE R_ID = O.R_ID)), 2) EXPECTED_INCOME
        FROM 
            (SELECT *
                FROM BUS B
                WHERE B.ID <> ALL (SELECT B_ID 
                                    FROM DRIVES 
                                    WHERE 
                                    TO_CHAR(OPERATE_DATE, 'YYYY-MM-DD') = TO_CHAR(SYSDATE,'YYYY-MM-DD'))) TD
        JOIN OPERATES O ON (TD.ID = O.B_ID AND TO_CHAR(OPERATE_DATE, 'YYYY-MM-DD') = TO_CHAR(SYSDATE + 1,'YYYY-MM-DD'))
        JOIN ROUTE R ON (O.R_ID = R.ID)
        ORDER BY EXPECTED_INCOME DESC`;
    let binds = {};
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getBusOwnedByCompany(company_id){
    let sql = `
        SELECT * 
        FROM BUS
        WHERE  COMPANY_ID = :id
    `;
    let binds = {
        id : company_id
    };
    return (await database.execute(sql, binds, database.options)).rows;
}

async function insertBus(licence_plate, capacity, company_id){
    let sql = `
        INSERT INTO BUS (LICENCE_PLATE_NUMBER, CAPACITY, COMPANY_ID) 
        VALUES (:LICENCE_PLATE_NUMBER, :CAPACITY, :COMPANY_ID)
    `;
    let binds = {
        LICENCE_PLATE_NUMBER: licence_plate,
        CAPACITY : capacity,
        COMPANY_ID: company_id
    };

    return (await database.execute(sql, binds,database.options));
}

module.exports = {
    getBus,
    getBusDynamicStatus,
    getBusNotAssignedToday,
    getCompanyBus : getBusOwnedByCompany,
    insertBus
}