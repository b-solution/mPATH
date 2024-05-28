<template>
  <div>
    <div v-if="this.isLoggedIn">
      <tabsbar :class="{'d-none': isProgramView }"></tabsbar>
      <filter-sidebar v-if="contentLoaded" :class="{'d-none': isProgramView }"></filter-sidebar>
      <router-view></router-view>
    </div>    
    <div v-else>
      <login-view></login-view>
    </div>
    
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import Tabsbar from "./../shared/tabsbar.vue";
import FilterSidebar from "./../shared/filter_sidebar.vue";
import SettingsSidebar from "../views/settings/SettingsSidebar.vue";
import LoginView from "../views/LoginView.vue";

import MessageDialogService from "../../services/message_dialog_service.js";

export default {
  name: "Dashboard",
  components: {
    LoginView,
    Tabsbar,
    FilterSidebar,
    SettingsSidebar
  },
  mounted() {
    if(this.isLoggedIn){
      let id = this.$route.params.programId;
      this.fetchDashboardData({ id });
      // Prevent right-click context-menu from appearing accross whole app
      window.oncontextmenu = (e) => {
        if (e.target.nodeName !== "INPUT" && e.target.nodeName !== "TEXTAREA") {
          e.preventDefault();
        }
      };
    }
  },
  methods: {
    ...mapActions(["fetchDashboardData"]),
    ...mapMutations(["setUnfilteredFacilities"])
  },
  computed: {
    ...mapGetters(["isLoggedIn","contentLoaded", "facilities", "getUnfilteredFacilities"]),
      isProgramView() {
      return this.$route.name && (
             this.$route.name.includes("ProgramView") ||
             this.$route.name.includes("ProgramTaskForm") ||
             this.$route.name.includes("ProgramRiskForm") ||
             this.$route.name.includes("ProgramIssueForm") ||
             this.$route.name.includes("ProgramContractLessonForm") ||  
             this.$route.name.includes("ProgramLessonForm") ); 
      },
  },

  updated() {
    if (this.contentLoaded && this.getUnfilteredFacilities.length === 0) {
      this.setUnfilteredFacilities(this.facilities);
    }
  },
};
</script>
