const model = require('./models')
// {force: true}
model.sequelize.sync({force: true}).then(async () => {
    console.log('init db ok.');
    process.exit(0);
    // console.log(model.postsDao)
    // console.log(model.postsDao.tasks)
    // console.log(model.postsDao.getTasks)
    // console.log(model.termsDao)
    // console.log(Object.getOwnPropertyDescriptors(model.postsDao))
    // console.log(model.postsDao.prototype)
    // let result = await model.postsDao({
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



