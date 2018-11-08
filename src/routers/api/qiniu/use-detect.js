
const {termDao, userDao, postDao, postMetaDao, sequelize} = require('../../../models/index')

const useList = require('./use-detect')

class UrlDetectBase {
    constructor (name) {
        this.name = name
    }
    detectUrl (url) {
        throw new Error('Method not defined')
    }
}

/**
 * 在文章内容中探测
 */
class PostContentDetect extends UrlDetectBase {
    constructor () {
        super('post')
        // 获取全部文章
        // this.posts =
    }
}

/**
 * 在文章内容中探测
 */
class CommentContentDetect extends UrlDetectBase {
    constructor () {
        super('comment')
    }
}

/**
 * 在用户引用中探测
 */
class UserDetect extends UrlDetectBase {
    constructor () {
        super('user-avatar')
    }
}

/**
 * 代码中探测
 */
class CodeDetect extends UrlDetectBase {
    constructor () {
        super('other')
        this.useList = useList
    }
}

class Detect {
    constructor (){
        // 每次使用最好重新创建对象， 因为这些探测对象 里的数据需要重新获取
        this.targetList = [
            new PostContentDetect(),
            new CommentContentDetect(),
            new UserDetect(),
            new CodeDetect()
        ]
    }
    run (image) {
        let use = {}
        this.targetList.forEach((d)=>{
            use[d.name] = d.detectUrl(image.url)
        })
        return use
    }
}

module.exports = Detect
