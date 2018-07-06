const {termDao, sequelize} = require('./index')
const {Enum} = require('../common/enum')
const Op = sequelize.Op
termDao.findAll({
    attributes: ['name'],
    where:{
        taxonomy: Enum.TaxonomyEnum.POST_TAG,
        term_id:{[Op.in]: [1,3,30,27]}
    }
}).then((aa)=>{
    console.log(aa)
})
