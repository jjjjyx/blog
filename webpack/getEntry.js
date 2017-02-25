const glob = require('glob');
const path = require('path');

function getEntry(globPath) {
    var entries = {},
        basename, tmp, pathname;

    glob.sync(globPath).forEach((entry)=>{
        basename = path.basename(entry, path.extname(entry)).replace(/c\.|s\./,'');
        let tmp = entry.split('/').slice(3, -1);
        // console.log(tmp,basename,tmp.length);
        if (tmp[0] === 'blog')
            tmp.shift();
        if (tmp.length) {
            pathname = tmp.join("/") + '/' + basename;
        } else {
            pathname = basename;
        }
        entries[pathname] = entry;
    });
    return entries;
}

module.exports = getEntry;
