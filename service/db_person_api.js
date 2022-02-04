const database = require('./database')



async function findUserByPhone(phoneNumber){
    let sql = `
        SELECT 
            *
        FROM
            PERSON
        WHERE
            PHONE_NUMBER = :phone_number
    `;
    let binds = {
        phone_number : phoneNumber
    };

    return (await database.execute(sql, binds,database.options)).rows;
}

async function findUserById(user_id){
    let sql = `
        SELECT 
            *
        FROM
            PERSON
        WHERE
            ID = :id
    `;
    let binds = {
        id : user_id
    };

    return (await database.execute(sql, binds,database.options)).rows;
}

async function insertUser(name, phoneNumber, password){
    let sql = `
       INSERT INTO PERSON (NAME, PHONE_NUMBER, PASSWORD)
       VALUES(:NAME, :PHONE_NUMBER, :PASSWORD)
    `;
    let binds = {
        NAME : name,
        PHONE_NUMBER : phoneNumber,
        PASSWORD : password
    };

    return (await database.execute(sql, binds,database.options));
}

module.exports = {
    findUserByPhone,
    findUserById,
    insertUser
}