import * as media from '@/api/media'
import InvalidImage from './components/invalid-image'

export default {
    data () {
        return {
            syncLoading: false,
            detectStatus: '',
            invalidImageModalVisible: false,
            invalidImageData: []
        }
    },
    components: {
        InvalidImage
    },
    methods: {
        $$startDetect () {
            this.detectStatus = 'detecting'
            this.taskId = setTimeout(this.$$detect, 3000)
        },
        $$detectStop () {
            clearTimeout(this.taskId)
            this.detectStatus = 'end'
            this.$Notice.close('detect_notice')
        },
        async $$detect () {
            if (this.detetProgress === 100) {
                return this.$$detectStop()
            }
            try {
                let data = await media.getDetectData()
                this.detetProgress = data.rate
                this.invalidImageData.push(...data.data)
                this.taskId = setTimeout(this.$$detect, 3000)
            } catch (e) {
                this.$Message.error('探测出现异常:' + e.message)
                return this.$$detectStop()
            }
        },
        // 清除失效图片，包括缓存
        async clearInvalidImg () {
            // 开始或者结束
            if (this.detectStatus === 'detecting' || this.detectStatus === 'end') {
                this.invalidImageModalVisible = true
                return
            }
            this.detectStatus = 'start'
            this.$Notice.info({
                title: '提示',
                name: 'detect_notice',
                desc: '正在探测图片状态，请稍后！'
            })
            try {
                this.$$startDetect()
                await media.detect()
                // console.log(data)
                // this.invalidImageModalVisible = true
                // this.invalidImageData = data
            } catch (e) {
                if (e.code === 3) {
                    this.$Message.info(e.message)
                } else {
                    this.$Message.error('探测出现异常:' + e.message)
                    clearTimeout(this.taskId)
                    this.detectStatus = ''
                }
                // this.$Notice.close('detect_notice')
            }
        },
        async sync () {
            this.syncLoading = true
            try {
                this.$Notice.info({
                    title: '提示',
                    name: 'sync_notice',
                    desc: '正在同步，过程需要一些时间，请稍后！'
                })
                await media.sync()
                this.$Message.success('同步完成')
                this.data = []
                this.isNext = true
                this.currPage = 1
                this.fetchMedia() // 刷新当前空间
            } catch (e) {
                this.$Message.error('同步出现异常:' + e.message)
            } finally {
                this.syncLoading = false
                this.$Notice.close('sync_notice')
            }
        // },
        // test () {
        //     this.$openImageSelectModal({ multiple: true }).then((selected) => {
        //         console.log(selected)
        //     }).catch(() => {
        //         console.log('ccc')
        //     }) <i-button onClick={this.test} class="mr-2" slot="form-classNamens">test</i-button>
        }
    },
    render (h) {
        let on = {
            'update:visible': (v) => (this.invalidImageModalVisible = v),
            'update:data': (v) => (this.invalidImageData = v)
        }
        return <media-curd>
            <i-button onClick={this.clearInvalidImg} class="mr-2" slot="form-buttons">探测失效图片</i-button>
            <i-button onClick={this.sync} class="mr-2" loading={this.syncLoading} slot="form-buttons">同步本地图片</i-button>
            <invalid-image visible={this.invalidImageModalVisible} data={this.invalidImageData} {...{ on }}/>
        </media-curd>
    }
}
