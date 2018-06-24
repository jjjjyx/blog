const model = require('./models');
model.sequelize.sync().then(()=>{
    console.log('init db ok.');
    process.exit(0);
});


