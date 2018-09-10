'use strict'

const express = require('express')

const router = express.Router()
const debug = require('debug')('app:routers:category')
const {body, param} = require('express-validator/check')
const {Enum} = require('../common/enum')
const {termDao, userDao, postDao, postMetaDao, sequelize} = require('../models')

const Op = sequelize.Op

const renderCategoryList = [
    async function(req, res, next) {
        try {
            let list = await termDao.findAll({
                where: {
                    taxonomy: Enum.TaxonomyEnum.CATEGORY,
                    icon: {
                        [Op.not]: null,
                        [Op.ne]: ''
                    }
                },
                attributes: {
                    include:[
                        [sequelize.literal('(SELECT COUNT(`term_relationships`.`object_id`) FROM  `j_term_relationships` AS `term_relationships` WHERE `term_relationships`.`term_id` = `term`.`id` )'), 'count']
                    ]
                }
            })
            res.render('category-list', {list});
        } catch (e) {
            next(e)
        }
    }
]
const renderCategory = [
    param('slug').isLength({min: 6}),
    async function(req, res,next) {
        console.log(12312)
        next()
        // try {
        //
        // } catch (e) {
        //
        // }
    }
]

router.get('/', renderCategoryList);
router.get('/:slug', renderCategory);

module.exports = router
