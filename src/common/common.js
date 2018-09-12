const _ = require('lodash')
const re = /_(\w)/g;

// const {termDao, userDao, postDao, postMetaDao, sequelize} = require('../models')
// const {term_relationships: termRelationshipsDao } = sequelize.models
module.exports.transformStr3 = function(str) {
    return str.replace(re, function ($0, $1){
        return $1.toUpperCase();
    });
}

module.exports.transformMetas = function (metas = []) {
    let obj = {}
    if (_.isArray(metas)) {
        metas.forEach((item) => {
            obj[item.meta_key] = item
        })
    }
    return obj
}
