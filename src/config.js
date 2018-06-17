'use strict'
// module.exports
const debug = require('debug')('app:config')
const _ = require('lodash')

const CONFIG = {
	appPort: 3878,
	allowOrigin: 'http://localhost:3879',
	maxAge: 365 * 5 * 60000 * 60 * 24,
	secret: '$2a$10$5A/Wb/EnCwdS2Yxdk0ouGe4beJn7ZTpPD9ofzMdaLc45EgIZwURg6',
	qiUpload: {
		ACCESS_KEY: 'yON2TZBHksg2FxJdZzrZcm5hDLzEB-YG7I1iyw6I',
		SECRET_KEY: 'lAkKzNLxsNs9eQXJ6DTyjJAxf6A0A_wsTGYxZDGH',
		Bucket_Name: 'jyximg',
		Domain: 'http://oht47c0d0.bkt.clouddn.com/',
		UP_HOST: 'http://upload.qiniu.com',
		UC_HOST: 'http://uc.qbox.me',
		RS_HOST: 'http://rs.qbox.me',
		RSF_HOST: 'http://rsf.qbox.me'
	}
}

try {
	let pri = require('../private.js')

	_.merge(CONFIG, pri)
	debug('Loading private configuration', pri)
} catch (e) {
	debug('Failed to load private configuration!')
}

module.exports = CONFIG

// exports.APP_PORT = 3878;
// exports.db = db;
// exports.maxAge = 365*5*60000*60*24;
// exports.secret = "$2a$10$5A/Wb/EnCwdS2Yxdk0ouGe4beJn7ZTpPD9ofzMdaLc45EgIZwURg6"
// exports.allowOrigin = allowOrigin;
// exports.qiUpload= {
//     'ACCESS_KEY': 'yON2TZBHksg2FxJdZzrZcm5hDLzEB-YG7I1iyw6I',
//     'SECRET_KEY': 'lAkKzNLxsNs9eQXJ6DTyjJAxf6A0A_wsTGYxZDGH',
//     'Bucket_Name': 'jyximg',
//     'Domain': 'http://oht47c0d0.bkt.clouddn.com/',
//     UP_HOST : 'http://upload.qiniu.com',
//     UC_HOST :'http://uc.qbox.me',
//     RS_HOST : 'http://rs.qbox.me',
//     RSF_HOST : 'http://rsf.qbox.me'
// };
