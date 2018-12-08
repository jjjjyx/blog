
import { mapState, mapGetters } from 'vuex'

export default {
    computed: {
        ...mapState({
            'currentPost': state => state.post,
            'categoryList': state => state.data.categoryList
            // newTags: state => state.post.newTags
        }),
        ...mapGetters(['defaultCategoryValue', 'versions'])
    }
}
