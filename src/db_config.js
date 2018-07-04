const fs = require('fs');

module.exports = {
    development: {
        username: 'blog',
        password: 'C9XyX5dWd9CQjHwu',
        database: 'bolg2',
        host: '127.0.0.1',
        dialect: 'mysql',
        // timestamps: false,
    },
    test: {
        username: 'database_test',
        password: 'test',
        database: 'database_test',
        host: '127.0.0.1',
        dialect: 'mysql'
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOSTNAME,
        dialect: 'mysql',
        timestamps: false,
        // dialectOptions: {
        //     ssl: {
        //         ca: fs.readFileSync(__dirname + '/mysql-ca-master.crt')
        //     }
        // }
    }
};
