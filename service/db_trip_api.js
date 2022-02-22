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
async function checkTrip(user_id){
    let sql = `
        SELECT T.ID, L1.NAME "FROM", L2.NAME "TO", TO_CHAR(T.START_TIME, 'DD-MM-YYYY HH:MI') START_TIME
        FROM TRIP T
        JOIN LOCATION L1 ON (T.START_LOC_ID = L1.ID)
        JOIN LOCATION L2 ON (T.END_LOC_ID = L2.ID)
        WHERE T.P_ID = :P_ID AND T.END_TIME IS NULL
    `;
    let binds = {
        P_ID: user_id
    };
    return (await database.execute(sql, binds, database.options)).rows;
}

async function checkFinishedTrip(user_id){
    let sql = `
        SELECT T.ID, L1.NAME "FROM", L2.NAME "TO", TO_CHAR(T.START_TIME, 'DD-MM-YYYY HH:MI') START_TIME
        FROM TRIP T
        JOIN LOCATION L1 ON (T.START_LOC_ID = L1.ID)
        JOIN LOCATION L2 ON (T.END_LOC_ID = L2.ID)
        WHERE T.P_ID = :P_ID AND T.END_TIME IS NOT NULL AND T.RATING IS NULL
        ORDER BY T.END_TIME DESC
    `;
    let binds = {
        P_ID: user_id
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
async function endTrip(trip_id){
    let sql = `
       UPDATE TRIP
       SET END_TIME = SYSDATE
       WHERE ID = :TRIP_ID
    `;
    let binds = {
        TRIP_ID : trip_id
    };

    return (await database.execute(sql, binds,database.options));
}

async function getDriver(trip_id){
    let sql = `
        SELECT T.ID ,DS.DRIVER_ID
        FROM TRIP T
        JOIN DRIVES DS ON (TRUNC(T.START_TIME, 'DD') = TRUNC(DS.OPERATE_DATE, 'DD'))
        WHERE T.ID = :TRIP_ID
    `;
    let binds = {
        TRIP_ID: trip_id
    };
    return (await database.execute(sql, binds, database.options)).rows;
}
async function rateTrip(trip_id, rating){
    let sql = `
       UPDATE TRIP
       SET RATING = :RATING
       WHERE ID = :TRIP_ID
    `;
    let binds = {
        TRIP_ID : trip_id,
        RATING: rating
    };

    return (await database.execute(sql, binds,database.options));
}
module.exports = {
    getTrip,
    insertTrip,
    checkTrip,
    checkFinishedTrip,
    endTrip,
    getDriver,
    rateTrip
}