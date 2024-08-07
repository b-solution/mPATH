// import                           'element-ui/lib/theme-chalk/index.css';
import './assets/common.scss'
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import 'vue2-datepicker/index.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import _ from 'lodash'
import Multiselect from 'vue-multiselect'
import VModal from 'vue-js-modal'
import * as VueGoogleMaps from 'vue2-google-maps'
import GmapCustomMarker from 'vue2-gmap-custom-marker'
import Dashboard from './components/dashboard/index.vue'
import LoginView from './components/views/LoginView.vue'
import HomeView from './components/views/HomeView.vue'
import router from './routers/dashboard'
import store from './store'
import utils from './mixins/utils'
import AuthorizationService from './services/authorization_service'
import MessageDialogService from './services/message_dialog_service'
import VeeValidate from 'vee-validate'
import GmapCluster from 'vue2-google-maps/dist/components/cluster'
import VueTelInput from 'vue-tel-input'
import DatePicker from 'vuejs-datepicker'
import VueSlideBar from 'vue-slide-bar'
import FadeLoader from 'vue-spinner/src/FadeLoader.vue'
import VTooltip from 'v-tooltip'
import V2DatePicker from 'vue2-datepicker'
import GanttElastic from 'gantt-elastic'
import GanttElasticHeader from 'gantt-elastic-header'
import VuePaginate from 'vue-paginate'
import vco from 'v-click-outside'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueDataTables from 'vue-data-tables'
import VueCookies from 'vue-cookies'

// import { FlatIcon } from '@flaticon/flaticon-uicons'

// import ElementUI            from 'element-ui';
// import locale               from 'element-ui/lib/locale/lang/en'

// Vue.use(ElementUI, { locale })

Vue.use(vco)
Vue.mixin(utils)
Vue.use(AuthorizationService)
Vue.use(MessageDialogService)
Vue.use(VTooltip)
Vue.use(VModal)
Vue.use(VueTelInput)
Vue.use(VuePaginate)
Vue.use(VueDataTables)
Vue.component('loader', FadeLoader)
Vue.component('gantt-elastic', GanttElastic)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('gantt-elastic-header', GanttElasticHeader)
Vue.component('vue-slide-bar', VueSlideBar)
Vue.component('date-picker', DatePicker)
Vue.component('v2-date-picker', V2DatePicker)
Vue.component('GmapCluster', GmapCluster)
Vue.component('GmapCustomMarker', GmapCustomMarker)
Vue.component('multiselect', Multiselect)
Vue.use(VueCookies)
Vue.config.productionTip = false
ELEMENT.locale(ELEMENT.lang.en)
Vue.use(VeeValidate, { fieldsBagName: 'veeFields' })

if (!window.google) {
  Vue.use(VueGoogleMaps, {
    load: {
      key: process.env.VUE_APP_GOOGLE_API_KEY,
      libraries: 'places'
    },
    installComponents: true
  })
}

Vue.prototype.$mpath_instance = window.mpath_instance

Vue.prototype.checkPrivileges = (page, salut, route, extraData) => {
  return AuthorizationService.checkPrivileges(page, salut, route, extraData)
}
Vue.prototype.$currentUser = AuthorizationService.current_user
Vue.prototype.$topNavigationPermissions = AuthorizationService.topNavigationPermissions()
Vue.prototype.$preferences = AuthorizationService.preferences

// // eslint-disable-next-line no-unused-vars
const dashboardApp = new Vue({
  router,
  store,
  el: '#dashboard',
  vuetify: new Vuetify(),
  template: '<HomeView />',
  components: { HomeView }
})

// Adding global logger so that we can debug data in template
// e.g. {{$log("projectUsers", projectUsers)}} and it will do console.log
Vue.prototype.$log = console.log
