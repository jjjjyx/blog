// ;(function(factory) {
//     "use strict";
//
// 	// CommonJS/Node.js
// 	if (typeof require === "function" && typeof exports === "object" && typeof module === "object")
//     {
//         module.exports = factory;
//     }
// 	else if (typeof define === "function")  // AMD/CMD/Sea.js
// 	{
//         if (define.amd) // for Require.js
//         {
//             /* Require.js define replace */
//         }
//         else
//         {
// 		    define([], factory);  // for Sea.js
//         }
// 	}
// 	else
// 	{
//         window.editormd = factory();
// 	}
//
// }
(function() {
    "use strict";
    var Message = function(options){
        // console.log(Message.prototyp)
        // return new Message.init(options);
        var defaultsOption = {
            type:'info',
            icon:'',
            close:'',
            message:''
        }
        options = Object.assign(defaultsOption,options)
        if(options.message){
            var defaults = {
                type: 1,
                title: false,
                closeBtn: 0,
                shade :0,
                shadeClose: true,
                anim:1,
                content: `<div class="j-alert am-alert j-alert-${options.type}" data-am-alert>
    ${options.message}
    </div>`,
                offset:['10px']
            }

            layer.open(defaults)
        }
    }

    // Message.prototype = {
    //     init:function(options){
    //
    //         return this;
    //     }
    // }
    // console.log(Message.init)
    // Message.init.prototype = Message.prototype;
    // editormd.fn.init.prototype = editormd.fn;
    layer.message = Message;
})()


// layer.message({
//     message:"asdas"
// })
