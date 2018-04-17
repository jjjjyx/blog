const Sequelize = require('sequelize');
const config = require("../config")
let db = config.db

const base = new Sequelize(db.database, db.user, db.password, {
    host:db.host,
    dialect:"mysql"
});

base
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');

    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


