/* eslint-disable no-undef, no-cond-assign */
import emojiData from './emoji.json'

const NEWLINE_REG = /\n+/
const EMOJI_REG = /^:([\w\\+-]+){1,20}:/
const USER_NICKNAME_REG = /^@([\u4e00-\u9fa5a-zA-Z0-9_-]{1,18})/
const INLINE_TEXT_REG = /^(`+|[^`])[\s\S]*?(?=[\\@\\:]|\b_| {2,}\n|$)/

const EMOJI_PATH = 'http://www.webpagefx.com/tools/emoji-cheat-sheet/graphics/emojis/'
const emojiList = emojiData.reduce((a, b) => a.concat(b.list), [])

// const block = {
//     newline: /^\n+/,
//     paragraph: /^([^\n]+(?:\n[^\n]+)*)/,
//     text: /^[^\n]+/
// }
function parseLine (line) {
    let cap = null
    let tokens = []

    while (line) {
        // EMOJI
        if (cap = EMOJI_REG.exec(line)) {
            // if (emojiList.indexOf(cap[1]) !== -1) {content
            line = line.substring(cap[0].length)
            tokens.push({
                type: 'emoji',
                text: cap[1],
                origin: cap[0]
            })
            continue
            // }
        }
        // at
        if (cap = USER_NICKNAME_REG.exec(line)) {
            // let user = _.find(members, ['user_nickname', cap[1]])
            // if (user) {
            line = line.substring(cap[0].length)
            tokens.push({
                type: 'at',
                text: cap[1],
                origin: cap[0]
            })
            continue
            // }
        }

        if (cap = INLINE_TEXT_REG.exec(line)) {
            line = line.substring(cap[0].length)
            tokens.push({
                type: 'text',
                text: cap[0]
            })
            continue
        }

        if (line) {
            throw new Error('Infinite loop on byte: ' + line.charCodeAt(0))
        }
    }
    tokens.push({
        type: 'newLine'
    })
    return tokens
}

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
        let { item } = ctx.props
        let { comment_content: content, members } = item

        let linesTokens = content.split(NEWLINE_REG).reduce((a, b) => a.concat(parseLine(b)), [])
        let tok = function (token) {
            let text = token.text
            switch (token.type) {
            case 'newLine':
                return <br/>
            case 'emoji':
                if (emojiList.indexOf(text) !== -1) {
                    return <img src={`${EMOJI_PATH}${text}.png`} title={text} alt={text} width="24"
                                class="align-middle"/>
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
        return linesTokens.map(tok)
    }
}
