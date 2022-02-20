const database = require('./database')
const oracledb = require("oracledb");

async  function getAllCompany(){
    let sql = `
        SELECT * 
        FROM COMPANY
    `;
    let binds = {};
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getNotApprovedCompany(){
    let sql = `
        SELECT * 
        FROM COMPANY
        WHERE LOWER(APPROVED) = 'false'
    `;
    let binds = {};
    return (await database.execute(sql, binds, database.options)).rows;
}

async function insertCompany(name){
    let sql = `
       INSERT INTO COMPANY (NAME, APPROVED)
       VALUES(:NAME, 'false')
       RETURNING ID INTO :c_id
    `;
    const role = 'owner';
    let binds = {
        NAME : name,
        c_id: {
            type : oracledb.NUMBER,
            dir: oracledb.BIND_OUT
        }
    };

    return (await database.execute(sql, binds,database.options)).outBinds;
}

async function approveCompany(company_id){
    let sql = `
       UPDATE COMPANY
       SET APPROVED = 'true'
       WHERE ID = :COMPANY_ID
    `;
    let binds = {
        COMPANY_ID : company_id
    };

    return (await database.execute(sql, binds,database.options));
}


module.exports = {
    getAllCompany,
    getNotApprovedCompany,
    insertCompany,
    approveCompany

}