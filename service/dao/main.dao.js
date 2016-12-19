"use strict";
import mysql from "mysql";

let connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'blogjyx',
    password: 'x.jyx.mysql'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution',  (err, rows, fields) => {
    if (err) throw err;
    console.log('The solution is: ', rows[0].solution);
});

connection.end();
