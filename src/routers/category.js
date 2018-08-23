'use strict'

const express = require('express')

const router = express.Router()
const debug = require('debug')('app:routers:category')
const {Enum} = require('../common/enum')
const {termDao, userDao, postDao, postMetaDao, sequelize} = require('../models')

const Op = sequelize.Op

const renderCategoryList = [
    async function(req, res) {
        let list = await termDao.findAll({
            where: {
                taxonomy: Enum.TaxonomyEnum.CATEGORY,
                icon: {
                    [Op.ne]: null
                }
            }
        })
        res.render('category', {list});
    }
]

router.get('/', renderCategoryList);

module.exports = router
