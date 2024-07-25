<template>
  <div class="filterbar">
    <div class="stick">
      <div @click="deselectProject" id="program_name" class="programNameDiv smallCaps pl-2 pr-3">
        {{ programName }}
      </div>
    </div>

    <div id="filter_bar">
      <h5 class="pt-3">
        <ul class="program-name">
          <router-link :to="adminGroupsView" v-if="_isallowedGroups('read')">
            <li class="p-3 mt-3 entity">
              <i class="fas fa-network-wired mr-2 mh-blue-text"></i>Groups
            </li>
          </router-link>
          <router-link :to="adminProjectsView" v-if="_isallowedProjects('read')">
            <li class="p-3 entity">
              <i class="fas fa-clipboard-list mr-3 mh-green-text"></i> Projects
            </li>
          </router-link>
          <router-link :to="adminContractsView" v-if="_isallowedContracts('read')">
            <li class="p-3 entity">
              <svg style="width: 16px;" class="svgAlignment" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                <path fill="#dd9036"
                  d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zM64 72c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H72c-4.4 0-8-3.6-8-8V72zm0 64c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H72c-4.4 0-8-3.6-8-8v-16zm192.8 248H304c8.8 0 16 7.2 16 16s-7.2 16-16 16h-47.2c-16.5 0-31.3-9.1-38.6-23.9-3-5.9-8.1-6.5-10.2-6.5s-7.2 .6-10 6.2l-7.7 15.3a16 16 0 0 1 -14.3 8.8c-.4 0-.8 0-1.1-.1-6.5-.5-12-4.8-14-10.9L144 354.6l-10.6 31.9c-5.9 17.7-22.4 29.5-41 29.5H80c-8.8 0-16-7.2-16-16s7.2-16 16-16h12.4c4.8 0 9.1-3.1 10.6-7.7l18.2-54.6c3.3-9.8 12.4-16.4 22.8-16.4s19.5 6.6 22.8 16.4l13.9 41.6c19.8-16.2 54.1-9.7 66 14.2 2 4.1 6 6.5 10.2 6.5zM377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z" />
              </svg> Contracts
            </li>
          </router-link>
          <router-link :to="adminVehiclesView" v-if="_isallowedContracts('read')">
            <li class="p-3 entity">
              <i class="fas fa-car mr-3 text-info"></i>Vehicles
            </li>
          </router-link>
          <router-link :to="adminRolesView" v-if="_isallowedUserRoles('read')">
            <li class="p-3 entity">
              <svg style="width: 23px;" class="svgAlignment" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                <path fill="#7952b3"
                  d="M224 256A128 128 0 1 0 96 128a128 128 0 0 0 128 128zm96 64a63.1 63.1 0 0 1 8.1-30.5c-4.8-.5-9.5-1.5-14.5-1.5h-16.7a174.1 174.1 0 0 1 -145.8 0h-16.7A134.4 134.4 0 0 0 0 422.4V464a48 48 0 0 0 48 48h280.9a63.5 63.5 0 0 1 -8.9-32zm288-32h-32v-80a80 80 0 0 0 -160 0v80h-32a32 32 0 0 0 -32 32v160a32 32 0 0 0 32 32h224a32 32 0 0 0 32-32V320a32 32 0 0 0 -32-32zM496 432a32 32 0 1 1 32-32 32 32 0 0 1 -32 32zm32-144h-64v-80a32 32 0 0 1 64 0z" />
              </svg>
              Roles
            </li>
          </router-link>
          <router-link :to="adminUsersView" v-if="_isallowedUserRoles('read')">
            <li class="p-3 entity">
              <i class="fas fa-users mr-2 pr-1 text-secondary"></i>Users
            </li>
          </router-link>

          <!-- <router-link :to="adminCloudView" > 
       <li class="p-3 entity">
            <i class="fal fa-cloud mr-2 text-info"></i>     MH Data
        </li>
    </router-link> -->
        </ul>
      </h5>

    </div>
    <div class="bottomBtn">
      <button class="btn btn-sm btn-light settingsBackBtn mb-4" @click.prevent="backToSheetView"
        style="cursor: pointer">
        <h6> <i class="far fa-arrow-square-left mr-1"></i> Back To Program</h6>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import MessageDialogService from "../../../services/message_dialog_service.js";
export default {
  name: 'SettingsSidebar',
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'getShowAdminBtn',
      'currentProject',
      'contentLoaded'
    ]),
    programName() {
      if (
        this.contentLoaded &&
        (this.currentProject !== null || this.currentProject !== undefined)
      ) {
        return this.currentProject.name;
      }
    },

    settingsLanding() {
      return `/programs/${this.$route.params.programId}/settings`;
    },
    backToSheetView() {
      this.$router.push(
        `/programs/${this.$route.params.programId}/sheet`
      );
    },

    adminProjectsView() {
      return `/programs/${this.$route.params.programId}/settings/projects`
    },
    adminContractsView() {
      return `/programs/${this.$route.params.programId}/settings/contracts`
    },
    adminVehiclesView() {
      return `/programs/${this.$route.params.programId}/settings/vehicles`
    },
    adminGroupsView() {
      return `/programs/${this.$route.params.programId}/settings/groups`
    },
    adminUsersView() {
      return `/programs/${this.$route.params.programId}/settings/users`
    },
    adminRolesView() {
      return `/programs/${this.$route.params.programId}/settings/roles`
    },
    adminCloudView() {
      return `/programs/${this.$route.params.programId}/settings/test_cloud_data`
    },
  },
  methods: {
    ...mapMutations([
      'setShowAdminBtn',
    ]),
    _isallowed(salut) {
      // return this.checkPrivileges("SettingsSidebar", salut, this.$route)

      let pPrivilege = this.$programPrivileges[this.$route.params.programId]
      let permissionHash = { "write": "W", "read": "R", "delete": "D" }
      let s = permissionHash[salut]
      return pPrivilege.contracts.includes(s);
    },
    _isallowedUserRoles(salut) {
      return this.checkPrivileges("SettingsUsers", salut, this.$route, { settingType: "Users" })
    },
    _isallowedProjects(salut) {
      return this.checkPrivileges("SettingsProjects", salut, this.$route, { settingType: "Projects" })
    },
    _isallowedGroups(salut) {
      return this.checkPrivileges("SettingsGroups", salut, this.$route, { settingType: "Groups" })
    },
    _isallowedContracts(salut) {
      return this.checkPrivileges("SettingsContracts", salut, this.$route, { settingType: 'Contracts' })
    },
    // _isallowedProgramSettings(settingType, salut) {
    //   let pPrivilege = this.$programSettingPrivileges[this.$route.params.programId]
    //   let permissionHash = {"write": "W", "read": "R", "delete": "D"}
    //   let settingTypeHash = {"Groups": "admin_groups", "Contracts": "admin_contracts", "Projects": "admin_facilities"}
    //   let s = permissionHash[salut]
    //   let type = settingTypeHash[settingType]
    //   return pPrivilege[type].includes(s);
    // },
    toggleAdminFilter() {
      this.setShowAdminBtn(!this.getShowAdminBtn)
    },
    log(e) {
      // console.log(e);  
    },
    deselectProject(e) {
      if (e.target.id === "program_name") {
        this.$router.push(
          `/programs/${this.$route.params.programId}/settings`
        );
      }
    },
  }
}

</script>

<style lang="scss" scoped>
.filterbar {
  position: absolute;
  z-index: 1100;
  background-color: #ededed;
  width: 90%;
  transition: .4s ease;
}

.stick {
  position: fixed;
  z-index: 1;
  color: #fff;
  max-width: 16%;
  background-color: #DD9036;
}

.programNameDiv {
  box-shadow: 0 2.5px 2.5px rgba(0, 0, 0, 0.19), 0 3px 3px rgba(0, 0, 0, 0.23);
  line-height: 1.2;

  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    display: -webkit-box;
    -webkit-line-clamp: unset;
  }

  &.active {
    background-color: red !important;
    color: #007bff;
  }
}

.programNameDiv:hover {
  background-color: #8f510b;

}

#filter_bar {
  overflow-y: auto;
  border-radius: 4px;
  background-color: #ededed;
  height: calc(100vh - 94px);
  max-height: calc(100vh - 94px);
}

ul {
  list-style-type: none;

  /* Remove bullets */
  li {
    color: #212529 !important;
    /* default color of text to replace blue default link color */
  }
}

.entity:hover {
  background-color: rgba(91, 192, 222, 0.3);
  cursor: pointer;
}

.settingsBackBtn {
  position: fixed;
  bottom: -15px;
  left: 2.5%;
  z-index: 1140;
}
</style>
