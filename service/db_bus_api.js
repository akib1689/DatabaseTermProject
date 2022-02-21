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
    getCompanyBus : getBusOwnedByCompany,
    insertBus
}