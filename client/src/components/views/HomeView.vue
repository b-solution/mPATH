<template>
  <div>
    <div v-if="!this.isLoggedIn">
      <login-view></login-view>
    </div>
    <div v-else>
      <nav class="navbar navbar-expand-lg blue-gradient navbar-light" id="nav-wrap">
        <a class="navbar-brand pt-0" href="/">
          <img :src="mhLogo" /></a>
          <button
          aria-controls="navbartoggler"
          aria-expanded="false"
          aria-label="Toggle navigation"
          class="navbar-toggler ml-auto"
          data-target="#navbartoggler"
          data-toggle="collapse"
          type="button"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbartoggler">
          <ul class="navbar-nav mr-auto mt-2 mt-lg-0"></ul>
          <ul class="navbar-nav my-2 my-lg-0">
            <li class="nav-item">
              <a class="nav-link" data-turbolinks="false" data-cy="admin_panel" href="/admin"
                >Admin Panel</a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                target="_blank"
                href="https://mpath.atlassian.net/wiki/spaces/MUG/overview"
                >Help</a
              >
            </li>
            <li class="nav-item">
              <div v-if="this.getCurrentUser">
                <router-link :to="`/profile`">Welcome,{{this.getCurrentUser.email}}</router-link>
              </div>
            </li>
            <li class="nav-item">
              <a
                id="__logout"
                class="nav-link"
                data-cy="logout"
                rel="nofollow"
                data-method="delete"
                @click="logoutClick"
                >Log out</a
              >
            </li>
          </ul>
        </div>
      </nav>

      <div v-if="!this.isProgramListView()">
        <tabsbar :class="{ 'd-none': isProgramView }"></tabsbar>
        <filter-sidebar v-if="contentLoaded" :class="{ 'd-none': isProgramView }"></filter-sidebar>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import LoginView from './LoginView.vue'
import Tabsbar from './../shared/tabsbar.vue'
import FilterSidebar from './../shared/filter_sidebar.vue'
import SettingsSidebar from '../views/settings/SettingsSidebar.vue'
import AuthorizationService from '../../services/authorization_service'

export default {
  name: 'HomeView',
  data(){
    return {
      mhLogo: 'microhealthllc.png'
    }
  },
  components: {
    LoginView,
    Tabsbar,
    FilterSidebar,
    SettingsSidebar
  },
  mounted() {
    console.log('HomeView')
    if (this.isLoggedIn) {
      this.verifyToken
      // console.log("LoginView Mounted", this.isLoggedIn)
      this.$router.push({ name: 'ProgramListView' })
      this.fetchCurrentUser
    }
  },
  methods: {
    ...mapMutations(['nullifyLocalStorage']),
    async logoutClick(e){
      this.nullifyLocalStorage()
      this.$router.push(`/login`)
    },
    isProgramListView() {
      return this.$route.name && this.$route.name.includes('ProgramListView')
    }
  },
  computed: {
    ...mapGetters(['getCurrentUser','isLoggedIn', 'contentLoaded', 'facilities', 'getUnfilteredFacilities']),
    ...mapActions([
      'fetchCurrentUser', 'verifyToken'
    ]),
    isProgramView() {
      console.log('HomeView isProgramView', this.$route)
      return (
        this.$route.name &&
        (this.$route.name.includes('ProgramView') ||
          this.$route.name.includes('ProgramTaskForm') ||
          this.$route.name.includes('ProgramRiskForm') ||
          this.$route.name.includes('ProgramIssueForm') ||
          this.$route.name.includes('ProgramContractLessonForm') ||
          this.$route.name.includes('ProgramLessonForm') ||
          this.$route.name.includes('Profile')
          )

      )
    }
  }
}
</script>