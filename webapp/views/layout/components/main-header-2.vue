<template>
    <header class="main-header-container">
        <div class="main-header__minimize" @click.stop="toggleSidebarMini">
            <font-icon :type="collapsed ? 'md-menu': 'ios-arrow-back'" :size="28"></font-icon>
        </div>
        <!--<div class="">-->
        <!--<h3 class="h3">{{last.title}} <small>{{last.name}}</small></h3>-->
        <transition-group name="breadcrumb" tag="Breadcrumb" class="main-header__breadcrumb">
            <BreadcrumbItem v-for="(item,index) in breadCrumbList" :key="item.name"
                            @click.native="handleSelectRouter(item, index)">
                <font-icon :type="item.icon" v-if="item.icon"></font-icon>
                {{item.title || breadRouterName(item)}}
            </BreadcrumbItem>
        </transition-group>
        <div class="main-header--right">
            <Input suffix="ios-search" placeholder="" style="width: auto" />
            <template v-if="showDebug">
                <tooltip :content="$t('navbar.bug')">
                    <Badge dot :count="logs.length">
                        <Button type="error" icon="ios-bug-outline" size="small" @click="openErrorLog"></Button>
                    </Badge>
                </tooltip>
                <Modal v-model="errorModalVisible" :title="$t('navbar.bug')" width="90">
                    <Table :columns="errorColumns" :data="logs" class="error-table-warp"/>
                </Modal>
            </template>
            <tooltip :content="$t('navbar.screenFull')">
                <Button type="text" icon="md-qr-scanner" size="large" @click="screenFull"></Button>
            </tooltip>
            <Dropdown trigger="click" placement="bottom-end" @on-click="handleChangeI18n">
                <a href="javascript:void(0)">
                    {{$t('navbar.language')}}
                    <Icon type="ios-arrow-down"></Icon>
                </a>
                <DropdownMenu slot="list">
                    <DropdownItem :key="item.name" :selected="language === item.name" :name="item.name"
                                  v-for="item in langs">
                        {{item.label}}
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <Dropdown trigger="click" placement="bottom-end">
                <Avatar shape="square" icon="ios-person" class="mr-2" :src="user.user_avatar"/>
                <Icon type="ios-arrow-down"></Icon>
                <DropdownMenu slot="list" style="width: 180px">
                    <div class="ivu-dropdown__header">{{$t('navbar.welcome')}}<b>{{user.user_nickname}}</b></div>
                    <DropdownItem divided @click.native="handleSelectRouter({name: 'profile'})">{{$t('navbar.profile')}}</DropdownItem>
                    <!--<DropdownItem></DropdownItem>-->
                    <DropdownItem divided @click.native="logout">{{$t('navbar.logOut')}}</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    </header>
</template>

<script>
// import last from 'lodash/last'
import HeaderMixins from './main-hader-mixins'

export default {
    mixins: [HeaderMixins]
}
</script>
