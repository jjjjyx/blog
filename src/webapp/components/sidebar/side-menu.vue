<template>
<ul class="sidebar-wrap sidebar-menu">
    <!--<li class="sidebar-menu__header">内容管理</li>-->
    <li class="sidebar-menu__item sidebar-menu__item--active">
        <div >
            <font-icon type="icon-fabuwenzhang"></font-icon>
            <span>所有文章</span>
        </div>
    </li>
    <li class="sidebar-menu__item">
        <div>
            <font-icon type="icon-fabuwenzhang"></font-icon>
            <span>所有文章</span>
        </div>
    </li>
    <li class="sidebar-menu__sub sidebar-menu__item">
        <div>
            <font-icon type="ios-chatbubble-outline"></font-icon>
            <span>所有文章</span>
        </div>
        <ul class="sidebar-menu__submenu">
            <li class="sidebar-menu__item sidebar-menu__item--active">
                <div >
                    <font-icon type="icon-combinedshapecopy2"></font-icon>
                    <span>所有文章</span>
                </div>
            </li>
            <li class="sidebar-menu__item">
                <div>
                    <font-icon type="icon-combinedshapecopy2"></font-icon>
                    <span>所有文章</span>
                </div>
            </li>
        </ul>
    </li>
</ul>
</template>

<script>
export default {
    name: 'side-menu'
}
</script>
