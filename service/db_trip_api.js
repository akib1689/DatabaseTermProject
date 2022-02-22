const database = require("./database");

async function getTrip(company_id) {
    let sql = `
        SELECT B.ID, R.DRIVER_ID, TO_CHAR(R.OPERATE_DATE,'YYYY-MM-DD') OPERATE_DATE, D.DRIVING_LICENCE_NUMBER, D.RATING
        FROM BUS B
        JOIN REQUESTED R ON (B.ID = R.B_ID)
        JOIN DRIVER D ON (D.P_ID = R.DRIVER_ID)
        WHERE B.COMPANY_ID = :COMPANY_ID AND TO_CHAR(R.OPERATE_DATE,'YYYY-MM-DD') = TO_CHAR(SYSDATE + 1 , 'YYYY-MM-DD') 
    `;
    let binds = {
        COMPANY_ID: company_id
    };
    return (await database.execute(sql, binds, database.options)).rows;
}

async function insertTrip(start_id, end_id, bus_id, user_id) {
    let sql = `
       INSERT INTO TRIP (START_LOC_ID, END_LOC_ID, START_TIME, B_ID, P_ID)
       VALUES(:START_LOC_ID, :END_LOC_ID, SYSDATE, :B_ID, :P_ID)
    `;

    let binds = {
        START_LOC_ID: start_id,
        END_LOC_ID: end_id,
        B_ID: bus_id,
        P_ID: user_id
    };

    return (await database.execute(sql, binds, database.options));
}

module.exports = {
    getTrip,
    insertTrip
}