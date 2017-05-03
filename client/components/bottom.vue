<template>
<div>
    <f-footer></f-footer>
    <f-copyright></f-copyright>
    <div class="gotop" id="gotop" >
        <f-gotop></f-gotop>
        <a href="javascript:;" title="不知道为什么就想放个代码在这里" class="icon-faq icon-btn am-icon-code"></a>
    </div>
</div>
</template>
<script>
import FCopyright from "./copyright";
import FFooter from "./footer";
import FGotop from "./gotop";
export default {
    data: () => {
        return {

        }
    },
    components:{
        FCopyright,
        FFooter,
        FGotop
    }
}
</script>
