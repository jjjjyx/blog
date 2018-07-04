const model = require('./models')
model.sequelize.sync({force: true}).then(async () => {
    console.log('init db ok.');
    process.exit(0);
    // console.log(model.postsDao)
    // let result = await model.postsDao.findOne({
    //     // attributes: ['post_content'],
    //     where: {
    //         id: 77
    //         // post_status: [
    //         //     Enum.PostStatusEnum.PUBLISH, Enum.PostStatusEnum.DRAFT
    //         // ]
    //     },
    //     include: [
    //         {
    //             model: model.usersDao
    //         }
    //     ]
    // })

})

    // let result = model.usersDao.findOne({
    //     where: {
    //         id: 1
    //     },
    //     include: [
    //         {
    //             model: model.postsDao
    //         }
    //     ]
    // }).then((result)=>{
    //     console.log('result', result.toJSON())
    // })



