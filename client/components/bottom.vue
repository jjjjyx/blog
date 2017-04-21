<template>
    <div>
    <f-footer></f-footer>
    <f-copyright></f-copyright>
    <f-gotop></f-gotop>
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
