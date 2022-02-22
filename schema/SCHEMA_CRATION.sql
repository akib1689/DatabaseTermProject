create table ROUTE
(
    ID   NUMBER(8) generated as identity,
    NAME VARCHAR2(20) not null,
    primary key (ID)
);

create table COMPANY
(
    ID       NUMBER(8) generated as identity,
    NAME     VARCHAR2(50) not null,
    APPROVED VARCHAR2(10) not null,
    primary key (ID)
);

alter table COMPANY
    add constraint COMPANY_APPROVE
        check (approved in ('true', 'false'));

create table PERSON
(
    ID           NUMBER(8) generated as identity,
    NAME         VARCHAR2(50)  not null,
    PHONE_NUMBER CHAR(11),
    PASSWORD     VARCHAR2(100) not null,
    ROLE         VARCHAR2(20),
    primary key (ID)
);

alter table PERSON
    add constraint CHK_VAL
        check (ROLE in ('admin', 'owner', 'driver'));

create table DRIVER
(
    P_ID                   NUMBER(8)    not null,
    DRIVING_LICENCE_NUMBER VARCHAR2(20) not null,
    RATING                 NUMBER(3, 2),
    primary key (P_ID),
    foreign key (P_ID) references PERSON
);

create table BUS
(
    ID                   NUMBER(8) generated as identity,
    LICENCE_PLATE_NUMBER VARCHAR2(25) not null,
    CAPACITY             NUMBER(3)    not null,
    COMPANY_ID           NUMBER(8),
    primary key (ID),
    foreign key (COMPANY_ID) references COMPANY
);

create or replace trigger INSERT_BUS_DYNAMIC
    after insert
    on BUS
    for each row
DECLARE
BEGIN
    INSERT INTO BUS_DYNAMIC_STATUS(B_ID, X_COORDINATE, Y_COORDINATE, DIRECTION)
    VALUES
    ( :new.ID, 0, 0, -1);
END;

create table OPERATES
(
    B_ID         NUMBER(8) not null,
    R_ID         NUMBER(8) not null,
    OPERATE_DATE DATE      not null,
    primary key (B_ID, R_ID, OPERATE_DATE),
    foreign key (B_ID) references BUS,
    foreign key (R_ID) references ROUTE
);

create table DRIVES
(
    B_ID         NUMBER(8) not null,
    DRIVER_ID    NUMBER(8) not null,
    OPERATE_DATE DATE      not null,
    primary key (B_ID, DRIVER_ID, OPERATE_DATE),
    foreign key (B_ID) references BUS,
    foreign key (DRIVER_ID) references DRIVER
);

create or replace trigger DELETE_REQUESTED
    after insert
    on DRIVES
    for each row
DECLARE
BEGIN
    DELETE
    FROM requested
    where (B_ID=:new.B_ID OR Driver_ID=:new.Driver_ID)
		AND	TO_CHAR(OPERATE_DATE, 'YYYY-MM-DD') = TO_CHAR(:new.OPERATE_DATE, 'YYYY-MM-DD');
END;

create table TRIP
(
    ID           NUMBER(8) generated as identity,
    START_LOC_ID NUMBER(8),
    END_LOC_ID   NUMBER(8),
    START_TIME   DATE not null,
    END_TIME     DATE not null,
    B_ID         NUMBER(8),
    P_ID         NUMBER(8),
    primary key (ID),
    foreign key (B_ID) references BUS,
    foreign key (P_ID) references PERSON
);

create table LOCATION
(
    ID   NUMBER(8) generated as identity,
    NAME VARCHAR2(50) not null,
    primary key (ID)
);

create table CONTAINS
(
    R_ID NUMBER(8) not null,
    L_ID NUMBER(8) not null,
    primary key (R_ID, L_ID),
    foreign key (R_ID) references ROUTE,
    foreign key (L_ID) references LOCATION
);

create table FARE
(
    R_ID  NUMBER(8) not null,
    L1_ID NUMBER(8) not null,
    L2_ID NUMBER(8) not null,
    FARE  NUMBER(4),
    primary key (R_ID, L1_ID, L2_ID),
    foreign key (R_ID) references ROUTE,
    foreign key (L1_ID) references LOCATION,
    foreign key (L2_ID) references LOCATION
);

create table BUS_DYNAMIC_STATUS
(
    B_ID         NUMBER(8) not null,
    X_COORDINATE NUMBER(10, 8),
    Y_COORDINATE NUMBER(11, 8),
    DIRECTION    NUMBER(1),
    primary key (B_ID),
    foreign key (B_ID) references BUS
);

create table OWNER
(
    P_ID NUMBER(8) not null,
    C_ID NUMBER(8) not null,
    primary key (P_ID),
    foreign key (P_ID) references PERSON,
    foreign key (C_ID) references COMPANY
);

create table REQUESTED
(
    B_ID         NUMBER(8) not null,
    DRIVER_ID    NUMBER(8) not null,
    OPERATE_DATE DATE      not null,
    primary key (B_ID, DRIVER_ID, OPERATE_DATE),
    foreign key (B_ID) references BUS,
    foreign key (DRIVER_ID) references DRIVER
);


