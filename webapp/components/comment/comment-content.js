/* eslint-disable no-undef, no-cond-assign */
import emojiData from './emoji.json'

const NEWLINE_REG = /^\n+/
const EMOJI_REG = /:([\w\\+-]+){1,20}:/
const USER_NICKNAME_REG = /@([\u4e00-\u9fa5a-zA-Z0-9_-]{1,18})/
const TEXT_REG = /^[^\n]+/
const EMOJI_PATH = 'http://www.webpagefx.com/tools/emoji-cheat-sheet/graphics/emojis/'

const emojiList = emojiData.reduce((a, b) => a.concat(b.list), [])
export default {
    name: 'comment-content',
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    functional: true,
    render (h, ctx) {
        // v-html="parent.renderCommentContent(item.comment_content)"
        // onClick="reply(comment.id, item2)"
        let {item} = ctx.props
        let {comment_content: content, members} = item
        let cap = null

        let tokens = []
        // todo 如果起始匹配不在行首就会出现截断错误， 比如 asd ::kissing_smiling_eyes:
        while (content) {
            // newline
            if (cap = NEWLINE_REG.exec(content)) {
                content = content.substring(cap[0].length)
                if (cap[0].length > 1) {
                    tokens.push({
                        type: 'space'
                    })
                }
            }
            // EMOJI
            if (cap = EMOJI_REG.exec(content)) {
                // if (emojiList.indexOf(cap[1]) !== -1) {
                content = content.substring(cap[0].length)
                tokens.push({
                    type: 'emoji',
                    text: cap[1],
                    origin: cap[0]
                })
                continue
                // }
            }
            // at
            if (cap = USER_NICKNAME_REG.exec(content)) {
                // let user = _.find(members, ['user_nickname', cap[1]])
                // if (user) {
                content = content.substring(cap[0].length)
                tokens.push({
                    type: 'at',
                    text: cap[1],
                    origin: cap[0]
                })
                continue
                // }
            }
            // text
            if (cap = TEXT_REG.exec(content)) {
                // Top-level should never reach here.
                content = content.substring(cap[0].length)
                tokens.push({
                    type: 'text',
                    text: cap[0]
                })
                continue
            }

            if (content) {
                throw new Error('Infinite loop on byte: ' + content.charCodeAt(0))
            }
        }
        let tok = function (token) {
            let text = token.text
            switch (token.type) {
            case 'space':
                return <br/>
            case 'emoji':
                if (emojiList.indexOf(text) !== -1) {
                    return <img src={`${EMOJI_PATH}${text}.png`} title={text} alt={text} width="24" class="align-middle"/>
                } else {
                    return token.origin
                }
            case 'at':
                let user = _.find(members, ['user_nickname', text])
                if (user) {
                    return <a href="javascript:void(0);">{token.origin}</a>
                } else {
                    return token.origin
                }
            case 'text':
                return text
            }
        }
        return tokens.map(tok)
    }
}
