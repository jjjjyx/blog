export default {
    name: 'comment-reply-item',
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
        return <li class="reply-list__item">
            <div class="comment-user-avatar float-left">
                <img src={item.comment_author_avatar} alt="user-avatar"/>
            </div>
            <div class="reply-content">
                <comment-username class="reply-content__body" user={item.user}>
                    <comment-content item={item}/>
                </comment-username>
                <div class="reply-content__footer">
                    <time dateTime={item.createdAt}>{item.time}</time>
                    <font-icon type="icon-zan" class="opt j-logo--a"/>
                    <span>0</span>
                    <i-button type="text" size="small" onClick={() => ctx.parent.reply(item)}>回复</i-button>
                    <i-button type="text" size="small">举报</i-button>

                </div>
            </div>

        </li>
    }
}
// {/*<span class="float-right j-report j-logo--a">举报</span>*/}
