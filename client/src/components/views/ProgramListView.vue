<template>
  <div>
    <div class="mt-2 container">
      <div class="container mb-2 text-center d-inline-block">
        <h4 class="text-center mt-1 mpath-logo">Welcome to</h4>
        <span>
          <svg class="mpathLogo" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 600 250">
            <path style="fill: #24366f"
              d="M28.07,112.38,25.82,124q9.65-13.22,24.26-13a21.34,21.34,0,0,1,12.52,3.77,15.45,15.45,0,0,1,6.18,10.11,36.2,36.2,0,0,1,11.4-10.35,27.41,27.41,0,0,1,14.17-3.53q10.19.19,15.11,6.71t4.06,18l-.13,1.52-7.87,46.6H97.66l7.8-46.68a38.26,38.26,0,0,0,.06-7.4q-1.32-11.69-13.35-11.88a22.66,22.66,0,0,0-14.83,5.25,22.89,22.89,0,0,0-8.5,13.44l-8.19,47.27H52.78l7.93-47.27q1.92-18.23-13.41-18.69a22.49,22.49,0,0,0-14.14,4.75,23.6,23.6,0,0,0-8.79,12.15l-8.46,49.06H8l12.43-71.51Z" />
            <path style="fill: #24366f"
              d="M146.8,151.17l-5.68,32.72H118.51l16.66-96.23,34.56.07q16.07,0,25.28,8.91t8.1,23.11a31.42,31.42,0,0,1-6.21,16.83,34.47,34.47,0,0,1-14.31,10.9,50.65,50.65,0,0,1-19.93,3.76Zm3.11-17.84,13.61.13q8.59-.19,13.15-5.59t3.64-13.29a10.2,10.2,0,0,0-3.08-6.39,10.51,10.51,0,0,0-6.7-2.62l-15.8-.06Z" />
            <path style="fill: #24366f"
              d="M245.31,165.84H214.58l-8.53,18H181.14l51-96.23h21.28l17.78,96.23H247.62ZM223,148h20l-4.23-33.17Z" />
            <path style="fill: #24366f" d="M353.86,105.57h-28l-13.55,78.32H289.63l13.61-78.32H275.68l3.17-17.91H357Z" />
            <polygon style="fill: #24366f"
              points="418.54 87.66 411.93 125.86 378.88 125.86 385.56 87.66 362.89 87.66 346.23 183.89 368.83 183.89 375.84 143.71 408.82 143.71 401.88 183.89 424.35 183.89 441.07 87.66 418.54 87.66" />
            <path style="fill:#dd9035"
              d="M547.7,110.64a13,13,0,0,0-10.9-12.8,71.13,71.13,0,0,0-64.47-41.23,6.3,6.3,0,1,0,0,12.59,58.54,58.54,0,0,1,52.6,33,12.94,12.94,0,0,0,5.66,20.77c.12,1.57.2,3.15.2,4.74a58.53,58.53,0,0,1-58.46,58.47,57.86,57.86,0,0,1-25-5.59A6.3,6.3,0,0,0,442,191.93a71.1,71.1,0,0,0,101.42-64.27c0-2.38-.13-4.74-.36-7.07A13,13,0,0,0,547.7,110.64Z" />
            <path style="fill:#9ec64d"
              d="M567.67,127.66a94.84,94.84,0,0,0-60.38-88.72,6.29,6.29,0,1,0-4.62,11.71,82.69,82.69,0,0,1,37,125,12.56,12.56,0,0,0-2.61-.27,13,13,0,0,0-12.5,16.41,82.38,82.38,0,0,1-52.26,18.64c-2.33,0-4.68-.1-7-.29a6.3,6.3,0,1,0-1.05,12.55c2.65.22,5.35.33,8,.33a94.85,94.85,0,0,0,61.11-22.22,12.94,12.94,0,0,0,15.83-16.88A94.85,94.85,0,0,0,567.67,127.66Z" />
            <path style="fill: #24366f"
              d="M502.94,12a13,13,0,0,0-23.08-3.73c-2.49-.15-5-.24-7.53-.24A119,119,0,0,0,370.51,64.83a6.3,6.3,0,1,0,10.71,6.62,106.48,106.48,0,0,1,91.11-50.82c2.1,0,4.19.07,6.26.19a12.95,12.95,0,0,0,21.58,3.49A107.05,107.05,0,1,1,440.5,229.89a6.29,6.29,0,0,0-3.74,12A119.65,119.65,0,1,0,502.94,12Z" />
          </svg>
        </span>
      </div>
      <div class="container mb-2 pr-0 text-right d-inline-block">
        <router-link :to="`/portfolio`" class="mr-2 portfolioViewerBtn">PORTFOLIO DATA
          VIEWER</router-link>
        <router-link :to="`/portfolio/contracts`" class="portfolioContractsBtn bg-light">CONTRACTS</router-link>
      </div>
      <div class="grid-container program-name">
        <router-link v-for="project in this.allProjects" :key="project.id" :to="`/programs/${project.id}/sheet`"
          class="">
          <li class="list-group-item pb-0 portfolio-page" @click="fetchProgramRelatedData(project.id)">
            <div class="row program-row">
              <div class="col-12">
                <div class="welcome-page-program-name" data-cy="project_name"><span class="absolute-center"></span>
                  <h4>{{ project.name }}</h4>
                </div>
              </div>
            </div>
            <hr class="hr-program-row">
            <div class="row mt-0 justify-content-between" data-cy="project_count">
              <div class="col-6 text-light"><span class="project-count bg-dark p-2">PROJECTS:
                  {{ project.facilities.length }} </span></div>
              <div class="col-6 text-right" data-cy="user_count"><span class="project-count text-dark p-2">USERS:
                  {{ project.users.length }} </span></div>
            </div><br>
            <div class="row mb-0 justify-content-between">
              <div class="col-4 text-dark font-sm" data-cy="actions">Actions</div>
              <div class="col-2 text-dark font-sm pl-1">#</div>
              <div class="col-6 text-dark font-sm text-center" data-cy="progress">Progress</div>
            </div>
            <div class="row font-md mt-0" data-cy="tasks">
              <div class="col-4 py-0"><span class="text-dark mr-1">TASKS</span></div>
              <div class="col-2 pl-0 py-0"><span
                  class="badge lt-green text-dark badge-pill font-weight-light text-left">
                  {{ project.tasks.length }}</span></div>
              <div class="col-6 py-0"><span><span class="w-100 progress pg-content text-light progress-0">
                    <div class="text-dark font-weight-light ml-1 d-flex align-items-center">0.00 %</div>
                  </span></span></div>
            </div>
            <div class="row font-md" data-cy="issues">
              <div class="col-4 py-0"><span class="text-dark mr-1">ISSUES</span></div>
              <div class="col-2 pl-0 py-0"><span
                  class="badge lt-yellow text-dark badge-secondary badge-pill font-weight-light text-left">{{
          project.issues.length }}</span>
              </div>
              <div class="col-6 py-0"><span><span class="w-100 progress pg-content progress-0">
                    <div class="text-dark font-weight-light ml-1 d-flex align-items-center">0.00 %</div>
                  </span></span></div>
            </div>
            <div class="row font-md" data-cy="risks">
              <div class="col-4 py-0"><span class="text-dark mr-1">RISKS</span></div>
              <div class="col-2 pl-0 py-0"><span
                  class="badge lt-red text-dark badge-secondary badge-pill font-weight-light text-left">{{
          project.risks.length }}</span>
              </div>
              <div class="col-6 py-0"><span></span><span class="w-100 progress pg-content progress-0">
                  <div class="text-dark font-weight-light ml-1 d-flex align-items-center">0.00 %</div>
                </span></div>
            </div>
            <div class="row font-md mb-1">
              <div class="col-4 py-0"><span class="text-dark mr-1">LESSONS</span></div>
              <div class="col-2 pl-0 py-0"><span
                  class="badge bg-primary text-light badge-secondary badge-pill font-weight-light text-left">{{
          project.lessons.length }}</span>
              </div>
              <div class="col-6 py-0"><span></span></div>
            </div>
            <div class="row mb-0 py-0 text-center" data-cy="overall_progress">
              <div class="col-12 text-dark font-sm mb-0 pb-0">Overall Program Progress</div>
            </div>
            <div class="row mt-0 pt-0">
              <div class="col-12"><span class="w-100 progress pg-content progress-0">
                  <div class="text-dark font-weight-light ml-1 d-flex align-items-center">0.00 %</div>
                </span></div>
            </div>
            <br>
          </li>
        </router-link>
      </div>
      <!-- <router-view></router-view> -->
      <!-- <h1>All Programs</h1>
      <div v-for="project in this.allProjects" :key="project.id" >
        <p><router-link :to="`/programs/${project.id}/sheet`"><span @click="fetchProgramRelatedData(project.id)">{{project.name}}</span></router-link></p>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import AuthorizationService from '../../services/authorization_service.js'

export default {
  name: "ProgramListView",
  props: ["facility"],
  data() {
    return {
      mPathLogo: 'mpath.svg'
    }
  },
  components: {},
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
    fetchProgramRelatedData(project_id) {
      AuthorizationService.getRolePrivileges(project_id);
    },
    // goToPortfolio() {
    //   console.log("Portfolio---")
    //   this.$router.push({ name: 'PortfolioView' })
    // }
  },
  beforeCreate() {
    console.log("ProgramListView beforeCreate", this.allProjects)
  },
  mounted() {
    this.fetchAllPrograms()
    this.fetchProjectFacilityHash()
    this.fetchPreferences()
    this.fetchProgramAdminRole()
    console.log("ProgramListView mounted", this.allProjects)

    const preferences = "{&quot;navigation_menu&quot;:&quot;map&quot;,&quot;sub_navigation_menu&quot;:null,&quot;program_id&quot;:null,&quot;project_id&quot;:null,&quot;project_group_id&quot;:null}";

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
