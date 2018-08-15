const _ = require('lodash')
const re = /_(\w)/g;
module.exports.transformStr3 = function(str) {
    return str.replace(re, function ($0, $1){
        return $1.toUpperCase();
    });
}
function getMetasObj (){
    return exports.transformMetas(this.metas)
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

module.exports.addMetaPrototype = function (Bean) {
    Bean.prototype.getMetasObj = getMetasObj
}
