"use strict";
// import mysql from "mysql";
let mysql = require("mysql");

let config = require("../../config/config");
console.log(config.db);

var pool = mysql.createPool(config.db);

exports.pool = pool;
