
const re = /_(\w)/g;
module.exports.transformStr3 = function(str) {
    return str.replace(re, function ($0, $1){
        return $1.toUpperCase();
    });
}
