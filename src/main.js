import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import Vuetify from 'vuetify'
import App from './App.vue'
import router from '@/router';

import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

import 'animate.css/animate.css'

import SocialSharing from 'vue-social-sharing'
Vue.use(SocialSharing);

import '@fortawesome/fontawesome-free/css/all.css'
Vue.use(Vuetify, {
    iconfont: 'fa'
})

import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

Vue.config.productionTip = false

const domain = 'factchecker.xyz'
Vue.prototype.domain = domain
Vue.prototype.api_url = `https://${domain}:4433/api`
Vue.prototype.media_server_url = `https://${domain}:8080/uploads`

const messages = {
    en: {
        sort: {
            createdAt: 'Created At',
            views: 'Views',
            evidence: 'Evidence',
            trust: 'Number of Trust',
            support: 'Support',
            against: 'Against'
        },
        view: {
            gridView: 'Grid View',
            slideView: 'Slide View',
            vs: "vs"
        },
        text: {
            trust: 'Trust',
            link: 'Related Link'
        },
        tooltips: {
            evidence: 'Related Evidence',
            newEvidence: 'Create a new evidence',
            newFact: 'Create a new fact',
            share: 'Share',
            views: 'Views',
            report: 'Report',
            bookmark: 'Bookmark'
        },
        snackbars: {
            bookmark: 'Bookmarked',
            undoBookmark: 'Undo bookmark',
        }
    },
    ch: {
        sort: {
            createdAt: '創建日期',
            views: '觀見次數',
            evidence: '證據',
            trust: '相任度',
            support: '支持',
            against: '反對'
        },
        view: {
            gridView: '網格視圖',
            slideView: '幻燈片視圖',
        },
        text: {
            trust: '相任',
            link: '相關網頁',
            vs: "比",
            created: '創建於'
        },
        tooltips: {
            evidence: '相關證據',
            newEvidence: '創建新證據',
            newFact: '創建新事件',
            share: '分享',
            views: '觀見次數',
            report: '報告',
            bookmark: '加入書籤'
        },
        snackbars: {
            bookmark: '已加入書籤',
            undoBookmark: '復原加入書籤',
        }
    }
}

const i18n = new VueI18n({
    locale: 'ch', // set locale
    messages, // set locale messages
})

new Vue({
    i18n,
    router,
    render: h => h(App),
    // beforeCreate: function() {
    //     window.alert(this.$appName)
    // }
}).$mount('#app')