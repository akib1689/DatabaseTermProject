const database = require("./database");

async function getRequested(company_id){
    let sql = `
        SELECT B.ID, R.DRIVER_ID, TO_CHAR(R.OPERATE_DATE,'YYYY-MM-DD') OPERATE_DATE, D.DRIVING_LICENCE_NUMBER, D.RATING
        FROM BUS B
        JOIN REQUESTED R ON (B.ID = R.B_ID)
        JOIN DRIVER D ON (D.P_ID = R.DRIVER_ID)
        WHERE B.COMPANY_ID = :COMPANY_ID AND TO_CHAR(R.OPERATE_DATE,'YYYY-MM-DD') = TO_CHAR(SYSDATE + 1 , 'YYYY-MM-DD') 
    `;
    let binds = {
        COMPANY_ID : company_id
    };
    return (await database.execute(sql, binds, database.options)).rows;
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

module.exports ={
    insertRequest,
    getRequested
}