<template>
  <div class="row">
    <div class="col-md-2">
      <SettingsSidebar />
    </div>
    <div class="col-md-10">
      <div class="right-panel">
        <h4 class="mt-4">
          <i class="far fa-cog mh-orange-text"></i> PROGRAM SETTINGS
        </h4>
        <div class="px-5">
          <ul class="grid-container">
            <!-- Move back into li attributes after finished with Users module   :class="{'d-none': !_isallowedProgramSettings(item, 'read') }" -->
            <li v-show="contentLoaded &&
                (item == 'Groups' && _isallowedGroups('read')) ||
                (item == 'Projects' && _isallowedProjects('read')) ||
                ((item == 'Contracts' || item == 'Vehicles') && _isallowedContracts('read')) ||
                (item == 'Users' && _isallowedUserRoles('read')) ||
                (item == 'Roles' && _isallowedUserRoles('read'))
                " class="m-2 cardWrapper list-group-item"
              v-for="(item, index) of settingsCards" :key="index" style="width:350px"
              @click.prevent="adminRoute(index)">
              <div>
                <div class="p-2" style="font-size:3.5rem">
                  <span v-if="item == 'Groups'">
                    <i class="fas fa-network-wired mr-3 mh-blue-text"></i></span>
                  <span v-if="item == 'Projects'">
                    <i class="fas fa-clipboard-list mr-3 mh-green-text"></i></span>
                  <span v-if="item == 'Contracts'">
                    <svg style="width: 36px;" xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 384 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                      <path fill="#dd9036"
                        d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zM64 72c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H72c-4.4 0-8-3.6-8-8V72zm0 64c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H72c-4.4 0-8-3.6-8-8v-16zm192.8 248H304c8.8 0 16 7.2 16 16s-7.2 16-16 16h-47.2c-16.5 0-31.3-9.1-38.6-23.9-3-5.9-8.1-6.5-10.2-6.5s-7.2 .6-10 6.2l-7.7 15.3a16 16 0 0 1 -14.3 8.8c-.4 0-.8 0-1.1-.1-6.5-.5-12-4.8-14-10.9L144 354.6l-10.6 31.9c-5.9 17.7-22.4 29.5-41 29.5H80c-8.8 0-16-7.2-16-16s7.2-16 16-16h12.4c4.8 0 9.1-3.1 10.6-7.7l18.2-54.6c3.3-9.8 12.4-16.4 22.8-16.4s19.5 6.6 22.8 16.4l13.9 41.6c19.8-16.2 54.1-9.7 66 14.2 2 4.1 6 6.5 10.2 6.5zM377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z" />
                    </svg>
                    <i class="fas fa-file-contract mr-3 mh-orange-text"></i>
                  </span>
                  <span v-if="item == 'Vehicles'">
                    <i class="fas fa-car mr-3 text-info"></i>
                  </span>
                  <span v-if="item == 'Users'">
                    <i class="fas fa-users mr-3 text-secondary"></i>
                  </span>
                  <span v-if="item == 'Roles'">
                    <svg style="width: 50px;" xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                      <path fill="#7952b3"
                        d="M224 256A128 128 0 1 0 96 128a128 128 0 0 0 128 128zm96 64a63.1 63.1 0 0 1 8.1-30.5c-4.8-.5-9.5-1.5-14.5-1.5h-16.7a174.1 174.1 0 0 1 -145.8 0h-16.7A134.4 134.4 0 0 0 0 422.4V464a48 48 0 0 0 48 48h280.9a63.5 63.5 0 0 1 -8.9-32zm288-32h-32v-80a80 80 0 0 0 -160 0v80h-32a32 32 0 0 0 -32 32v160a32 32 0 0 0 32 32h224a32 32 0 0 0 32-32V320a32 32 0 0 0 -32-32zM496 432a32 32 0 1 1 32-32 32 32 0 0 1 -32 32zm32-144h-64v-80a32 32 0 0 1 64 0z" />
                    </svg> </span>
                  <!-- <span v-if="item == 'MH Data'">
                    <i class="fal fa-cloud mr-2 text-info"></i>              
                  </span> -->
                  <!-- <span v-if="item == 'Users'">   <i class="far fa-users mr-3"></i> </span> -->
                </div>
                <div>
                  <h4>
                    <span v-if="item == 'Groups'">
                      {{ settingsCards.groups }}</span>
                    <span v-if="item == 'Projects'">
                      {{ settingsCards.projects }}</span>
                    <span v-if="item == 'Contracts'">{{ settingsCards.contracts }}
                    </span>
                    <span v-if="item == 'Vehicles'">{{ settingsCards.vehicles }}
                    </span>
                    <span v-if="item == 'Users'">{{ settingsCards.users }}
                    </span>
                    <span v-if="item == 'Roles'">{{ settingsCards.roles }}
                    </span>
                  </h4>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import SettingsSidebar from "./SettingsSidebar.vue";
import AuthorizationService from "@/services/authorization_service";
export default {
  name: "SettingsView",
  components: {
    SettingsSidebar,
  },
  data() {
    return {
      settingsCards: {
        groups: "Groups",
        projects: "Projects",
        contracts: "Contracts",
        vehicles: "Vehicles",
        users: "Users",
        roles: "Roles",
        // mhData: "MH Data",
        // users: "Users"
      },
      projectNameText: "",
      selectedProjectGroup: null,
      projectName: "",
      newProjectName: "",
      newProjectGroupName: "",
      contractNameText: "",
      value: "",
      expanded: {
        id: "",
      },
    };
  },
  mounted() {
    this.fetchCurrentProject(this.$route.params.programId)
  },
  methods: {
    ...mapMutations(["setProjectGroupFilter"]),
    ...mapActions(["fetchCurrentProject"]),
    _isallowed(salut) {
      return this.checkPrivileges("SettingsView", salut, this.$route, {});
      // let pPrivilege = this.$programPrivileges[this.$route.params.programId]
      // let permissionHash = {"write": "W", "read": "R", "delete": "D"}
      // let s = permissionHash[salut]
      // return pPrivilege.contracts.includes(s);
    },
    _isallowedUserRoles(salut) {
      return this.checkPrivileges("SettingsUsers", salut, this.$route, {
        settingType: "Users",
      });
    },
    _isallowedProjects(salut) {
      return this.checkPrivileges("SettingsProjects", salut, this.$route, {
        settingType: "Projects",
      });
    },
    _isallowedGroups(salut) {
      return this.checkPrivileges("SettingsGroups", salut, this.$route, {
        settingType: "Groups",
      });
    },
    _isallowedContracts(salut) {
      return this.checkPrivileges("SettingsContracts", salut, this.$route, {
        settingType: "Contracts",
      });
    },
    adminRoute(index) {
      // console.log(event, index, "This")
      if (index == "groups") {
        this.$router.push(
          `/programs/${this.$route.params.programId}/settings/groups`
        );
      }
      if (index == "projects") {
        this.$router.push(
          `/programs/${this.$route.params.programId}/settings/projects`
        );
      }
      if (index == "contracts") {
        this.$router.push(
          `/programs/${this.$route.params.programId}/settings/contracts`
        );
      }
      if (index == "vehicles") {
        this.$router.push(
          `/programs/${this.$route.params.programId}/settings/vehicles`
        );
      }
      if (index == "mhData") {
        this.$router.push(
          `/programs/${this.$route.params.programId}/settings/test_cloud_data`
        );
      }
      if (index == "users") {
        this.$router.push(
          `/programs/${this.$route.params.programId}/settings/users`
        );
      }
      if (index == "roles") {
        this.$router.push(
          `/programs/${this.$route.params.programId}/settings/roles`
        );
      }
    },
    _isallowedProgramSettings(salut, settingType) {
      return this.checkPrivileges("SettingsView", salut, this.$route, {
        settingType: settingType,
      });
      // let pPrivilege = this.$programSettingPrivileges[this.$route.params.programId]
      // let permissionHash = {"write": "W", "read": "R", "delete": "D"}
      // let settingTypeHash = {"Groups": "admin_groups", "Contracts": "admin_contracts", "Projects": "admin_facilities"}
      // let s = permissionHash[salut]
      // let type = settingTypeHash[settingType]
      // return pPrivilege[type].includes(s);
    },
  },
  computed: {
    ...mapGetters([
      "contentLoaded",
      "facilities",
      "getProjectGroupFilter",
      "facilityGroupFacilities",
      "filteredFacilityGroups",
    ]),
  },
  C_projectGroupFilter: {
    get() {
      return this.getProjectGroupFilter;
    },
    set(value) {
      // console.log(value)
      this.setProjectGroupFilter(value);
    },
  },
};
</script>

<style scoped lang="scss">
.fa-calendar {
  font-size: x-large;
}

.tabs {
  background-color: #ededed;
  border-top: solid 0.3px #ededed;
  width: min-content;
  display: flex;
  box-shadow: 0 2.5px 2.5px rgba(0, 0, 0, 0.19), 0 3px 3px rgba(0, 0, 0, 0.23);

  .tab {
    cursor: pointer;
    padding: 7px 10px;
    border-radius: 0.1rem;
    font-weight: 500;
    letter-spacing: 1;
    transition: auto;
    font-size: 75%;
  }

  .active {
    color: #fff !important;
    background-color: #383838 !important;
  }
}

a {
  color: unset;
  text-decoration: unset;
}

.right-panel {
  height: calc(100vh - 100px);
  overflow-y: auto;
}

li {
  list-style-type: none;
  /* Remove bullets */
}

.cardWrapper {
  box-shadow: 0 2.5px 5px rgba(56, 56, 56, 0.19),
    0 3px 3px rgba(56, 56, 56, 0.23);
  transition: all 0.2s ease-in;
  cursor: pointer;
}

.cardWrapper:hover {
  transform: scale(1.015);
}
</style>
