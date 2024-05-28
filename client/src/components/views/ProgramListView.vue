

<template>
  <div>
    <div class="container">
      <h1>All Programs</h1>
      <div v-for="project in this.allProjects" :key="project.id" >
        <p><router-link :to="`/programs/${project.id}/sheet`"><span @click="fetchProgramRelatedData(project.id)">{{project.name}}</span></router-link></p>
      </div>
    </div> 
  </div>
</template>
  
  <script>
  import { mapGetters, mapActions,mapMutations } from "vuex";
  import AuthorizationService from '../../services/authorization_service.js'

  export default {
    name: "ProgramListView",
    props: ["facility"],
    components: {  },
    computed: {
      ...mapGetters([
        "contentLoaded",
        'getAllProjects',
        ]),
      allProjects: {
        get() {
          return this.getAllProjects;
        }
      },
    },
    actions: {
      ...mapActions([
        'doLogout'
      ])
    },
    methods: {
      ...mapActions([
        'fetchAllPrograms',
        'fetchProjectFacilityHash',
        'fetchPreferences',
        'fetchProgramAdminRole'
      ]),
      ...mapGetters([
        'getProjectFacilityHash'
      ]),
      fetchProgramRelatedData(project_id){
        console.log("fetchProgramRelatedData", this)
        AuthorizationService.getRolePrivileges(project_id);
      }
    },
    beforeCreate(){
      console.log("ProgramListView beforeCreate", this.allProjects)
    },
    mounted(){
      this.fetchAllPrograms()
      this.fetchProjectFacilityHash()
      this.fetchPreferences()
      this.fetchProgramAdminRole()
      console.log("ProgramListView mounted", this.allProjects)

      const preferences =  "{&quot;navigation_menu&quot;:&quot;map&quot;,&quot;sub_navigation_menu&quot;:null,&quot;program_id&quot;:null,&quot;project_id&quot;:null,&quot;project_group_id&quot;:null}";
      
      // var project_facility_hash = "{&quot;3&quot;:[{&quot;facility_id&quot;:1,&quot;facility_project_id&quot;:1},{&quot;facility_id&quot;:328,&quot;facility_project_id&quot;:2}]}";

      var privilege = "{&quot;map_view&quot;:&quot;R&quot;,&quot;gantt_view&quot;:&quot;R&quot;,&quot;members&quot;:&quot;R&quot;,&quot;settings_view&quot;:&quot;R&quot;,&quot;sheets_view&quot;:&quot;R&quot;,&quot;kanban_view&quot;:&quot;R&quot;,&quot;calendar_view&quot;:&quot;R&quot;,&quot;contract_data&quot;:&quot;RW&quot;}";

      var google_api_key = "APIKEY";
      
      AuthorizationService.privilege = JSON.parse(privilege.replace(/&quot;/g, '"'))

      Vue.prototype.$mpath_instance = window.mpath_instance

      // AuthorizationService.getRolePrivileges();
      Vue.prototype.checkPrivileges = (page, salut, route, extraData) => {
        return AuthorizationService.checkPrivileges(page, salut, route, extraData);
      };

      Vue.prototype.$topNavigationPermissions = AuthorizationService.topNavigationPermissions();


      // this.setPreferences(AuthorizationService.preferences)
      // this.setProgramAdminRole(AuthorizationService.program_admin_role)
      // this.setProjectFacilityHash(AuthorizationService.projectFacilityHash)


    },

  };
  </script>
  
  <style></style>