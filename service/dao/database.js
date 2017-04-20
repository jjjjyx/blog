"use strict";
// eventproxy
// import mysql from "mysql";
let mysql = require("mysql");
let async = require("async");

let config = require("../config");
// console.log(config.db);

config.db.queryFormat = function (query, values) {
    if (!values) return query;
    if(values instanceof Array){
        return mysql.format(query,values);
    }else

    return query.replace(/\:(\w+)|\?/g, function (txt, key) {
        if (values.hasOwnProperty(key)) {
            return this.escape(values[key]);
        }
        return txt;
    }.bind(this));
}
let pool = mysql.createPool(config.db);


class BaseDao {
    constructor(){

    }
    execCallBack(sql,data,callback,resultFormat){
        exports.pool.getConnection(function (err, connection) {
            if (err) {
                callback(true);
                return;
            }
            connection.query(sql,data,async function(err, result){
                if (err) {
                    console.log(err);
                    callback(true);
                } else {
                    if(typeof(resultFormat) == "function"){
                        callback(false, await resultFormat(result))
                    }else{
                        callback(false, result)
                    }
                }
                connection.release();
            })
        });
    }

    asyncExec(sql,data,resultFormat){
        return new Promise((resolve, reject) => {
            exports.pool.getConnection(function (err, connection) {
                if (err) {
                    return reject(err);
                }
                connection.query(sql,data,async function(err, result){
                    if (err) {
                        console.log(err);
                        return reject(err);
                    } else {
                        if(typeof(resultFormat) == "function"){
                            resolve(await resultFormat(result));
                        }else{
                            resolve(result);
                        }
                    }
                    connection.release();
                })
            });
        });
    }

    execTrans(sqlparamsEntities, callback) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return callback(err, null);
            }
            connection.beginTransaction(function (err) {
                if (err) {
                    return callback(err, null);
                }
                // console.log("开始执行transaction，共执行" + sqlparamsEntities.length + "条数据");
                var funcAry = [];
                sqlparamsEntities.forEach(function (sql_param) {
                    var temp = function (cb) {
                        var sql = sql_param.sql;
                        var param = sql_param.params;
                        var resultFormat = sql_param.resultFormat;
                        connection.query(sql, param, function (tErr, rows, fields) {
                            if (tErr) {
                                connection.rollback(function () {
                                    console.log("事务失败，" + sql_param + "，ERROR：" + tErr);
                                    cb(tErr);
                                });
                            } else {
                                if(resultFormat)
                                    return cb(null, resultFormat(rows));
                                else
                                    return cb(null, rows);

                            }
                        })
                    };
                    funcAry.push(temp);
                });

                async.series(funcAry, function (err, result) {
                    if (err) {
                        connection.rollback(function (err2) {
                            connection.release();
                            return callback(err, null);
                        });
                    } else {
                        connection.commit(function (err, info) {
                            // console.log("transaction info: " + JSON.stringify(info));
                            if (err) {
                                console.log("执行事务失败，" + err);
                                connection.rollback(function (err) {
                                    console.log("transaction error: " + err);
                                    connection.release();
                                    return callback(err, null);
                                });
                            } else {
                                connection.release();
                                return callback(null, result, info);
                            }
                        })
                    }
                })
            });
        });
    }
}

exports.pool = pool;
exports.BaseDao = BaseDao;

function _getNewSqlParamEntity(sql, params,resultFormat, callback) {
    if (callback) {
        return callback(null, {
            sql: sql,
            params: params
        });
    }
    return {
        sql,
        params,
        resultFormat
    };
}
