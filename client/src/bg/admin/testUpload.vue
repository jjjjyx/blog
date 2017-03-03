<template>
<div id="container" class="container">
    <a class="btn btn-default btn-lg " id="pickfiles">
        <i class="glyphicon glyphicon-plus"></i>
        <span>选择文件</span>
    </a>
</div>
</template>
<script>
export default {
    data: function() {
        return {}
    },
    components: {},
    computed: {

    },
    methods: {

    },
    mounted: function() {
        var uploader = Qiniu.uploader({
            runtimes: 'html5,flash,html4',
            browse_button: 'pickfiles',
            // container: 'container',
            // drop_element: 'container',
            max_file_size: '1000mb',
            flash_swf_url: '/Moxie.swf',
            dragdrop: true,
            chunk_size: '4mb',
            uptoken_url: "/api/img/token",
            domain: "http://oht47c0d0.bkt.clouddn.com/",
            get_new_uptoken: false,
            auto_start: true,
            log_level: 5,
            init: {
                'FilesAdded': function(up, files) {
                    // $('table').show();
                    // $('#success').hide();
                    // plupload.each(files, function(file) {
                    //     var progress = new FileProgress(file, 'fsUploadProgress');
                    //     progress.setStatus("绛夊緟...");
                    //     progress.bindUploadCancel(up);
                    // });
                    console.log(111);
                },
                'BeforeUpload': function(up, file) {
                },
                'UploadProgress': function(up, file) {
                },
                'UploadComplete': function() {
                },
                'FileUploaded': function(up, file, info) {
                    console.log(info);
                },
                'Error': function(up, err, errTip) {
                    console.log(errTip);
                }
                // ,
                // 'Key': function(up, file) {
                //     var key = "";
                //     // do something with key
                //     return key
                // }
            }
        });
        console.log(uploader);
    }
}
</script>
