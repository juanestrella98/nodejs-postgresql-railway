create database workouts;

create table workout(
    id serial primary key,
    name varchar(40),
    mode varchar(40),
    equipament text[],
    exercises text[],
    trainerTips text[],
    createdAt varchar(100),
    updateAt varchar(100)
);

INSERT into workout (name, mode, equipament, exercises, trainerTips, createdAt, updateAt) values
 ('juan', 'amrap', ARRAY['barbell'], ARRAY['15 deadlifts',
        '555'], ARRAY['deadlifts xd',
        'nono nono',
        'nono xddd'], now(), now());

/**/

create table member(
    id serial primary key,
    name varchar(100),
    genre char(1),
    birthday varchar(50),
    email varchar(100), 
    phone varchar(9),
    height real,
    weigh real,
    password varchar(20)
);

insert into member(name, genre, birthday, email, phone, height, weigh, password) values('juan', 'm', '1998/3/20', 'juan@hotmail.com', 644220732, 78, 1, 'nose');

/**/
create table records(
    id varchar(100) primary key,
    workout int,
    record varchar(100),
    foreign key (workout)
    references workout (id)
    on delete cascade
);

insert into records values('fff--ffff', 9, '145 reps');