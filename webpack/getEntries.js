const glob = require('glob');
const path = require('path');

function getEntry(globPath, webpackHotMiddlewareConfig) {
    var entries = {},
        basename, tmp, pathname;
    glob.sync(globPath).forEach((entry)=>{
        basename = path.basename(entry, path.extname(entry));
        pathname = basename;
        tmp = `./${basename}.js`
        if (webpackHotMiddlewareConfig) {
            entries[pathname] = [webpackHotMiddlewareConfig, tmp]
        } else {
            entries[pathname] = tmp;
        }

    });
    return entries;
}

module.exports = getEntry;
