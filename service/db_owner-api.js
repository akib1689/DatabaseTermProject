const database = require('./database')

async  function getCompanyManagedByPerson(person_id){
    let sql = `
        SELECT * 
        FROM OWNER
        WHERE P_ID = :P_ID
    `;
    let binds = {
        P_ID : person_id
    };
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getManagerOfCompany(company_id){
    let sql = `
        SELECT * 
        FROM OWNER
        WHERE C_ID = :C_ID
    `;
    let binds = {
        C_ID: company_id
    };

    return (await database.execute(sql, binds,database.options)).rows;
}

async function insertOwner(person_id, company_id){
    let sql = `
        INSERT INTO OWNER (P_ID, C_ID) VALUES (:P_ID, :C_ID)
    `;
    let binds = {
        P_ID : person_id,
        C_ID: company_id
    };

    return (await database.execute(sql, binds,database.options));
}

module.exports = {
    getCompany: getCompanyManagedByPerson,
    getManagers : getManagerOfCompany,
    insertOwner
}