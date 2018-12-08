const log4js = require('log4js')

log4js.configure({
    appenders: {
        access: {
            'type': 'dateFile',
            'filename': 'http-access.log',
            'pattern': '.yyyy-MM-dd',
            'compress': true
        },
        operation: {
            'type': 'dateFile',
            'filename': 'operation.log',
            'pattern': '.yyyy-MM-dd',
            'compress': true
        },
        out: { type: 'stdout' },
        app: {
            type: 'file',
            filename: 'application.log',
            'maxLogSize': 2097152, // 2M
            'numBackups': 3 // 备份 3 个
        }
    },
    categories: {
        http: { appenders: ['access'], level: 'info' },
        op: { appenders: ['out', 'operation'], level: 'debug' },
        default: { appenders: ['out', 'app'], level: 'debug' }
    }
})
const logger = require('../src/common/manageLog')('routers:home')
const { termDao, userDao, postDao, resourceDao, siteDao } = require('../src/models/index')
const ENUMERATE = require('../src/common/enumerate')
const CONSTANT = require('../src/common/constant')
// const modales = require('../src/models/index')
// const logger = log4js.getLogger('abc.xx')

logger.trace('Entering cheese testing')
logger.debug('Got cheese.')
logger.info('Cheese is Comté.')
logger.warn('Cheese is quite smelly.')
logger.error('Cheese is too ripe!')
logger.fatal('Cheese was breeding ground for listeria.')
userDao.findByPk(1).then((user) => {
    let req = {
        user: user
    }
    termDao.findByPk(1).then((term) => {
        logger.create(req, term, ENUMERATE.relatedTypeEnum.category)
        let oldObj = {
            name: term.name,
            slug: term.slug,
            description: term.description,
            icon: term.icon
        }
        let newObj = {
            name: 12321,
            slug: 'asd',
            description: 'aaa',
            icon: 'icon---'
        }
        logger.update(req, term, oldObj, newObj, ENUMERATE.relatedTypeEnum.post_tag)
        logger.delete(req, [term, term, term])
        logger.creates(req, [term, term, term])
        // console.log(data.constructor.name)
    })
    postDao.findByPk(821).then(async (post) => {
        logger.create(req, post)
        let oldObj = {
            post_title: post.post_title,
            post_content: post.post_content,
            post_excerpt: post.post_excerpt
        }
        let newObj = {
            post_title: '修改标题',
            post_content: post.post_content + 'aasd \n asdsa',
            post_excerpt: post.post_excerpt + 'post_excerpt \n post_excerpt'
        }
        let category1 = await termDao.findByPk(1)
        let category2 = await termDao.findByPk(80)

        logger.updatePost(req, post, oldObj, newObj)
        logger.updatePostTerm(req, post, [category1], [category2])
        logger.delete(req, post)
        // logger.update(req, term, oldObj, newObj, ENUMERATE.relatedTypeEnum.post_tag)
        // logger.delete(req, [term, term, term])
        // logger.creates(req, [term, term, term])
        // console.log(data.constructor.name)
    })
    resourceDao.findAll({
        where: {
            hash: ['Fg2ZZ0VmdYVnj8CsFy1-BGgmcsml', 'FgC40DiGtg1h_i3pA1HPsMC5NZFJ', 'FhVZNK0Co9a0t9y1qC3f9Nthbb6u', 'FiKtFPX73YH-t14pyss4a5IGlSrP'],
        }
    }).then((images) => {
        logger.creates(req, images, ENUMERATE.relatedTypeEnum.image)
        logger.create(req, images[0], ENUMERATE.relatedTypeEnum.image)
        // let oldObj = {
        //     name: term.name,
        //     slug: term.slug,
        //     description: term.description,
        //     icon: term.icon
        // }
        // let newObj = {
        //     name: 12321,
        //     slug: 'asd',
        //     description: 'aaa',
        //     icon: 'icon---'
        // }
        logger.changeImageSpace(req, images, 'avatar')
        logger.delete(req, images[0])
        // logger.update(req, term, oldObj, newObj, ENUMERATE.relatedTypeEnum.post_tag)
        // logger.delete(req, [term, term, term])
        // logger.creates(req, [term, term, term])
        // console.log(data.constructor.name)
    })
})
