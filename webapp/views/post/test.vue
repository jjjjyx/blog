<template>
    <div>
        <code-diff :old-string="oldStr" :new-string="newStr" :context="10"/>
    </div>
</template>

<script>
import CodeDiff from '@/components/code-diff/code-diff'

export default {
    name: 'post-test',
    components: { CodeDiff },
    data () {
        return {
            oldStr: 'old code',
            newStr: 'new code'
        }
    },
    mounted () {
    }
}
</script>
