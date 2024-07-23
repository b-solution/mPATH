import axios from 'axios'
import { API_BASE_PATH } from '../mixins/utils'

var id = window.current_program_id

const AuthorizationService = {
  projectPrivilegesRoles: {},
  programPrivilegesRoles: {},
  contractPrivilegesRoles: {},
  contractVehiclePrivilegesRoles: {},
  programSettingPrivilegesRoles: {},
  token: null,
  projectFacilityHash: {},
  program_admin_role: {},
  privilege: {},
  current_user: {},
  preferences: {},
  allowedNavigationTabs: {},
  allowedSubNavigationTabs: {},
  allowedSubNavigationForProgramSettingsTab: {},
  topNavigationPermissions: () => {
    var permissionHash = {}
    for (var key in AuthorizationService.privilege) {
      if (['id', 'created_at', 'updated_at', 'user_id'].includes(key)) continue
      var value = AuthorizationService.privilege[key]
      permissionHash[key] = {
        read: value.includes('R'),
        write: value.includes('W'),
        delete: value.includes('D')
      }
    }
    return permissionHash
  },

  getUserPreferences: () => {
    const token = localStorage.getItem('token')
    console.log('Token:', token)
    axios({
      method: 'GET',
      url: `${API_BASE_PATH}/users/preferences`,
      headers: {
        'X-CSRF-Token':
          document.querySelector('meta[name="csrf-token"]').attributes['content'].value,
        'x-token': token
      }
    })
      .then((res) => {
        AuthorizationService.allowedNavigationTabs = res.data.allowed_navigation_tabs
        AuthorizationService.allowedSubNavigationTabs = res.data.allowed_sub_navigation_tabs
        AuthorizationService.allowedSubNavigationForProgramSettingsTab =
          res.data.allowed_sub_navigation_for_program_settings_tabs
      })
      .catch((err) => {
        console.log('Error', err)
      })
      .finally(() => {})
  },
  getRolePrivileges: (project_id) => {
    let portfolioProgramID = project_id
    console.log('Testing roles-privs:')
    if (!portfolioProgramID) {
      let ww = window.location.pathname.split('/')
      let portfolioProgramID = ww[ww.length - 2]
      console.log('getRolePrivileges', ww)
    }
    const token = localStorage.getItem('token')

    axios({
      method: 'GET',
      url: `${API_BASE_PATH}/program_settings/users/get_user_privileges?program_id=${portfolioProgramID}`,
      headers: {
        'X-CSRF-Token':
          document.querySelector('meta[name="csrf-token"]').attributes['content'].value,
        'x-token': token
      }
    })
      .then((res) => {
        AuthorizationService.projectPrivilegesRoles = res.data.project_privilegs_roles
        AuthorizationService.programPrivilegesRoles = res.data.program_privilegs_roles
        AuthorizationService.contractPrivilegesRoles = res.data.contract_privilegs_roles
        AuthorizationService.contractVehiclePrivilegesRoles =
          res.data.contract_vehicle_privileges_roles
        AuthorizationService.programSettingPrivilegesRoles =
          res.data.program_settings_privileges_roles
      })
      .catch((err) => {
        console.log('Error', err)
      })
      .finally(() => {})
  },
  getProjectTabPrivilege: (route) => {
    let program_id = route.params.programId
    let contract_id = route.params.contractId
    let project_id = route.params.projectId
    let contract_vehicle_id = route.params.vehicleId
    // console.log(
    //   "getProjectTabPrivilege",
    //   program_id,
    //   contract_id,
    //   project_id,
    //   contract_vehicle_id,
    //   AuthorizationService.contractVehiclePrivilegesRoles
    // );
    if (contract_id) {
      return AuthorizationService.contractPrivilegesRoles[contract_id]
    } else if (contract_vehicle_id) {
      return AuthorizationService.contractVehiclePrivilegesRoles[contract_vehicle_id]
    } else {
      let facility_project_id = AuthorizationService.findFacilityProjectId(program_id, project_id)
      return AuthorizationService.projectPrivilegesRoles[facility_project_id]
    }
  },
  checkPortfolioContractPrivileges: (page, salut, route, extraData) => {
    let permissionHash = { write: 'W', read: 'R', delete: 'D' }
    let s = permissionHash[salut]
    return (
      AuthorizationService.privilege &&
      AuthorizationService.privilege.contract_data &&
      AuthorizationService.privilege.contract_data.includes(s)
    )
  },
  checkPortfolioVehiclePrivileges: (page, salut, route, extraData) => {
    let permissionHash = { write: 'W', read: 'R', delete: 'D' }
    let s = permissionHash[salut]
    return (
      AuthorizationService.privilege &&
      AuthorizationService.privilege.contract_vehicle_data &&
      AuthorizationService.privilege.contract_vehicle_data.includes(s)
    )
  },
  checkPrivileges: (page, salut, route, extraData) => {
    let permissionHash = { write: 'W', read: 'R', delete: 'D' }
    let s = permissionHash[salut]
    let program_id = route.params.programId
    let contract_id = route.params.contractId
    let project_id = route.params.projectId
    let contract_vehicle_id = route.params.vehicleId
    if (['project_tabs'].includes(page)) {
    } else if (['portfolio_risk_form'].includes(page)) {
      if (contract_id) {
        let contract_privileges = AuthorizationService.contractPrivilegesRoles[contract_id]
        return (
          contract_privileges &&
          contract_privileges.contract_risks &&
          contract_privileges.contract_risks.includes(s)
        )
      } else if (contract_vehicle_id) {
        let contract_vehicle_privileges =
          AuthorizationService.contractVehiclePrivilegesRoles[contract_vehicle_id]
        return (
          contract_vehicle_privileges &&
          contract_vehicle_privileges.contract_risks &&
          contract_vehicle_privileges.contract_risks.includes(s)
        )
      } else {
        let facility_project_id = AuthorizationService.findFacilityProjectId(program_id, project_id)
        let facility_project_privileges =
          AuthorizationService.projectPrivilegesRoles[facility_project_id]
        return (
          facility_project_privileges &&
          facility_project_privileges.project_risks &&
          facility_project_privileges.project_risks.includes(s)
        )
      }
    } else if (['effort_sheets'].includes(page)) {
      let facility_project_id = AuthorizationService.findFacilityProjectId(program_id, project_id)
      let facility_project_privileges =
        AuthorizationService.projectPrivilegesRoles[facility_project_id]
      return (
        facility_project_privileges &&
        facility_project_privileges.project_efforts &&
        facility_project_privileges.project_efforts.includes(s)
      )
    } else if (
      [
        'task_project_context_menu',
        'task_contract_context_menu',
        'task_vehicle_context_menu',
        'issue_project_context_menu',
        'issue_contract_context_menu',
        'issue_vehicle_context_menu',
        'risk_project_context_menu',
        'risk_contract_context_menu',
        'risk_vehicle_context_menu',
        ,
      ].includes(page)
    ) {
      let facility_project_id = extraData['facility_project_id']
      let project_contract_id = extraData['project_contract_id']
      let project_contract_vehicle_id = extraData['project_contract_vehicle_id']
      var is_task = [
        'task_project_context_menu',
        'task_contract_context_menu',
        'task_vehicle_context_menu'
      ].includes(page)
      var is_issue = [
        'issue_project_context_menu',
        'issue_contract_context_menu',
        'issue_vehicle_context_menu'
      ].includes(page)
      var is_risk = [
        'risk_project_context_menu',
        'risk_contract_context_menu',
        'risk_vehicle_context_menu'
      ].includes(page)

      if (project_contract_id) {
        let contract_privileges = AuthorizationService.contractPrivilegesRoles[project_contract_id]

        if (is_task) {
          return (
            contract_privileges &&
            contract_privileges.contract_tasks &&
            contract_privileges.contract_tasks.includes(s)
          )
        } else if (is_issue) {
          return (
            contract_privileges &&
            contract_privileges.contract_issues &&
            contract_privileges.contract_issues.includes(s)
          )
        } else if (is_risk) {
          return (
            contract_privileges &&
            contract_privileges.contract_risks &&
            contract_privileges.contract_risks.includes(s)
          )
        }
      } else if (project_contract_vehicle_id) {
        let contract_vehicle_privileges =
          AuthorizationService.contractVehiclePrivilegesRoles[project_contract_vehicle_id]

        if (is_task) {
          return (
            contract_vehicle_privileges &&
            contract_vehicle_privileges.contract_tasks &&
            contract_vehicle_privileges.contract_tasks.includes(s)
          )
        } else if (is_issue) {
          return (
            contract_vehicle_privileges &&
            contract_vehicle_privileges.contract_issues &&
            contract_vehicle_privileges.contract_issues.includes(s)
          )
        } else if (is_risk) {
          return (
            contract_vehicle_privileges &&
            contract_vehicle_privileges.contract_risks &&
            contract_vehicle_privileges.contract_risks.includes(s)
          )
        }
      } else if (facility_project_id) {
        let facility_project_privileges =
          AuthorizationService.projectPrivilegesRoles[facility_project_id]
        // console.log(page, extraData, facility_project_id, facility_project_privileges)

        if (is_task) {
          return (
            facility_project_privileges &&
            facility_project_privileges.project_tasks &&
            facility_project_privileges.project_tasks.includes(s)
          )
        } else if (is_issue) {
          return (
            facility_project_privileges &&
            facility_project_privileges.project_issues &&
            facility_project_privileges.project_issues.includes(s)
          )
        } else if (is_risk) {
          return (
            facility_project_privileges &&
            facility_project_privileges.project_risks &&
            facility_project_privileges.project_risks.includes(s)
          )
        }
      }
    } else if (
      [
        'portfolio_issue_form',
        'KanbanIssues',
        'issue_sheets_index',
        'issue_index',
        'issue_calendar',
        'issue_form'
      ].includes(page)
    ) {
      if (contract_id) {
        let contract_privileges = AuthorizationService.contractPrivilegesRoles[contract_id]
        return (
          contract_privileges &&
          contract_privileges.contract_issues &&
          contract_privileges.contract_issues.includes(s)
        )
      } else if (contract_vehicle_id) {
        let contract_vehicle_privileges =
          AuthorizationService.contractVehiclePrivilegesRoles[contract_vehicle_id]
        return (
          contract_vehicle_privileges &&
          contract_vehicle_privileges.contract_issues &&
          contract_vehicle_privileges.contract_issues.includes(s)
        )
      } else {
        let facility_project_id = AuthorizationService.findFacilityProjectId(program_id, project_id)
        let facility_project_privileges =
          AuthorizationService.projectPrivilegesRoles[facility_project_id]
        return (
          facility_project_privileges &&
          facility_project_privileges.project_issues &&
          facility_project_privileges.project_issues.includes(s)
        )
      }
    } else if (
      [
        'ProjectSidebar',
        'ProjectSettingContractList',
        'ProjectSettingVehicleList',
        'ProjectSettingProjectList'
      ].includes(page)
    ) {
      let pPrivileges = AuthorizationService.programSettingPrivilegesRoles

      if (extraData['method'] == 'isallowedProgramSettings') {
        return (
          (pPrivileges['program_setting_groups'] &&
            pPrivileges['program_setting_groups'].includes(s)) ||
          (pPrivileges['program_setting_contracts'] &&
            pPrivileges['program_setting_contracts'].includes(s)) ||
          (pPrivileges['program_setting_contract_vehicles'] &&
            pPrivileges['program_setting_contract_vehicles'].includes(s)) ||
          (pPrivileges['program_setting_projects'] &&
            pPrivileges['program_setting_projects'].includes(s)) ||
          (pPrivileges['program_setting_users_roles'] &&
            pPrivileges['program_setting_users_roles'].includes(s))
        )
      } else if (extraData['method'] == 'isallowedContracts') {
        let contract_privileges =
          AuthorizationService.contractPrivilegesRoles[extraData['project_contract_id']]
        // console.log(contract_privileges, extraData["project_contract_id"]);

        return (
          contract_privileges &&
          (contract_privileges.contract_analytics ||
            contract_privileges.contract_issues ||
            contract_privileges.contract_lessons ||
            contract_privileges.contract_notes ||
            contract_privileges.contract_risks ||
            contract_privileges.contract_tasks)
        )
      } else if (extraData['method'] == 'isallowedVehicles') {
        let contract_privileges =
          AuthorizationService.contractVehiclePrivilegesRoles[
            extraData['project_contract_vehicle_id']
          ]
        return (
          contract_privileges &&
          (contract_privileges.contract_analytics ||
            contract_privileges.contract_issues ||
            contract_privileges.contract_lessons ||
            contract_privileges.contract_notes ||
            contract_privileges.contract_risks ||
            contract_privileges.contract_tasks)
        )
      } else if (extraData['method'] == 'isallowedProject') {
        let facility_project_privileges =
          AuthorizationService.projectPrivilegesRoles[extraData['facility_project_id']]

        return (
          facility_project_privileges &&
          (facility_project_privileges.project_analytics ||
            facility_project_privileges.project_issues ||
            facility_project_privileges.project_lessons ||
            facility_project_privileges.project_notes ||
            facility_project_privileges.project_risks ||
            facility_project_privileges.project_tasks)
        )
      } else {
        return false
      }
    } else if (['ProjectRollup'].includes(page)) {
      let pPrivileges = AuthorizationService.programSettingPrivilegesRoles

      if (extraData['method'] == 'isallowedContracts') {
        return (
          pPrivileges['program_setting_contracts'] &&
          pPrivileges['program_setting_contracts'].includes(s)
        )
      } else if (extraData['method'] == 'isallowedVehicles') {
        return (
          pPrivileges['program_setting_contract_vehicles'] &&
          pPrivileges['program_setting_contract_vehicles'].includes(s)
        )
      } else {
        return false
      }
    } else if (
      [
        'ContractLessons',
        'VehicleLessons',
        'SheetLessons',
        'portfolio_lesson_form',
        'MapLessons',
        'LessonContextMenu',
        'ContractLessonForm',
        'VehicleLessonForm',
        'LessonForm'
      ].includes(page)
    ) {
      if (contract_id) {
        let contract_privileges = AuthorizationService.contractPrivilegesRoles[contract_id]
        return (
          contract_privileges &&
          contract_privileges.contract_lessons &&
          contract_privileges.contract_lessons.includes(s)
        )
      } else if (contract_vehicle_id) {
        let contract_vehicle_privileges =
          AuthorizationService.contractVehiclePrivilegesRoles[contract_vehicle_id]
        return (
          contract_vehicle_privileges &&
          contract_vehicle_privileges.contract_lessons &&
          contract_vehicle_privileges.contract_lessons.includes(s)
        )
      } else {
        let facility_project_id = AuthorizationService.findFacilityProjectId(program_id, project_id)
        let facility_project_privileges =
          AuthorizationService.projectPrivilegesRoles[facility_project_id]
        return (
          facility_project_privileges &&
          facility_project_privileges.project_lessons &&
          facility_project_privileges.project_lessons.includes(s)
        )
      }
    } else if (
      [
        'notes_show',
        'notes_sheets',
        'contract_notes_form',
        'vehicle_notes_form',
        'notes_form',
        'notes_index',
        'notes_sheets_index'
      ].includes(page)
    ) {
      if (contract_id) {
        let contract_privileges = AuthorizationService.contractPrivilegesRoles[contract_id]
        return (
          contract_privileges &&
          contract_privileges.contract_notes &&
          contract_privileges.contract_notes.includes(s)
        )
      } else if (contract_vehicle_id) {
        let contract_vehicle_privileges =
          AuthorizationService.contractVehiclePrivilegesRoles[contract_vehicle_id]
        return (
          contract_vehicle_privileges &&
          contract_vehicle_privileges.contract_notes &&
          contract_vehicle_privileges.contract_notes.includes(s)
        )
      } else {
        let facility_project_id = AuthorizationService.findFacilityProjectId(program_id, project_id)
        let facility_project_privileges =
          AuthorizationService.projectPrivilegesRoles[facility_project_id]
        return (
          facility_project_privileges &&
          facility_project_privileges.project_notes &&
          facility_project_privileges.project_notes.includes(s)
        )
      }
    } else if (
      [
        'KanbanRisks',
        'risk_sheets_index',
        'risk_calendar',
        'risk_index',
        'risk_show',
        'risk_form'
      ].includes(page)
    ) {
      if (contract_id) {
        let contract_privileges = AuthorizationService.contractPrivilegesRoles[contract_id]
        return (
          contract_privileges &&
          contract_privileges.contract_risks &&
          contract_privileges.contract_risks.includes(s)
        )
      } else if (contract_vehicle_id) {
        let contract_vehicle_privileges =
          AuthorizationService.contractVehiclePrivilegesRoles[contract_vehicle_id]
        return (
          contract_vehicle_privileges &&
          contract_vehicle_privileges.contract_risks &&
          contract_vehicle_privileges.contract_risks.includes(s)
        )
      } else {
        let facility_project_id = AuthorizationService.findFacilityProjectId(program_id, project_id)
        let facility_project_privileges =
          AuthorizationService.projectPrivilegesRoles[facility_project_id]
        return (
          facility_project_privileges &&
          facility_project_privileges.project_risks &&
          facility_project_privileges.project_risks.includes(s)
        )
      }
    } else if (
      [
        'portfolio_task_form',
        'KanbanTasks',
        'task_sheet',
        'facility_show',
        'task_sheets_index',
        'task_index',
        'task_calendar',
        'task_form'
      ].includes(page)
    ) {
      if (contract_id) {
        let contract_privileges = AuthorizationService.contractPrivilegesRoles[contract_id]
        return (
          contract_privileges &&
          contract_privileges.contract_tasks &&
          contract_privileges.contract_tasks.includes(s)
        )
      } else if (contract_vehicle_id) {
        let contract_vehicle_privileges =
          AuthorizationService.contractVehiclePrivilegesRoles[contract_vehicle_id]
        return (
          contract_vehicle_privileges &&
          contract_vehicle_privileges.contract_tasks &&
          contract_vehicle_privileges.contract_tasks.includes(s)
        )
      } else {
        let facility_project_id = AuthorizationService.findFacilityProjectId(program_id, project_id)
        let facility_project_privileges =
          AuthorizationService.projectPrivilegesRoles[facility_project_id]
        if (extraData && extraData['method'] == 'isAllowedFacilityContextMenu') {
          console.log(page, extraData, facility_project_id, facility_project_privileges)
        }
        return (
          facility_project_privileges &&
          facility_project_privileges.project_tasks &&
          facility_project_privileges.project_tasks.includes(s)
        )
      }
    } else if (
      [
        'SheetContract',
        'SheetVehicle',
        'MapAnalytics',
        'MapOverview',
        'MapProject',
        'SheetAnalytics',
        'SheetProject',
        'ContractAnalytics',
        'VehicleAnalytics',
        'Kanban'
      ].includes(page)
    ) {
      if (contract_id) {
        let contract_privileges = AuthorizationService.contractPrivilegesRoles[contract_id]
        return (
          contract_privileges &&
          contract_privileges.contract_analytics &&
          contract_privileges.contract_analytics.includes(s)
        )
      } else if (contract_vehicle_id) {
        let contract_vehicle_privileges =
          AuthorizationService.contractVehiclePrivilegesRoles[contract_vehicle_id]
        return (
          contract_vehicle_privileges &&
          contract_vehicle_privileges.contract_analytics &&
          contract_vehicle_privileges.contract_analytics.includes(s)
        )
      } else {
        let facility_project_id = AuthorizationService.findFacilityProjectId(program_id, project_id)

        console.log('SheetProject', facility_project_id, program_id, project_id)

        let facility_project_privileges =
          AuthorizationService.projectPrivilegesRoles[facility_project_id]
        return (
          facility_project_privileges &&
          facility_project_privileges.project_analytics &&
          facility_project_privileges.project_analytics.includes(s)
        )
      }
    }
    // NOTE: not in use, if no error found, please remove this code.
    // else if( ["ProgramContractsSheet", "ProgramView","SettingsSidebar" ].includes(page)){
    //   let pPrivilege = Vue.prototype.$programPrivileges[route.params.programId]
    //   let permissionHash = {"write": "W", "read": "R", "delete": "D"}
    //   let s = permissionHash[salut]
    //   if (pPrivilege && pPrivilege.contracts){
    //     return pPrivilege.contracts.includes(s);
    //   }
    // }
    else if (
      [
        'SettingsView',
        'SettingsGroups',
        'SettingsProjects',
        'SettingsContracts',
        'SettingsVehicles',
        'SettingsUsers',
        'SettingsRolesIndex'
      ].includes(page)
    ) {
      let permissionHash = { write: 'W', read: 'R', delete: 'D' }
      let pPrivileges = AuthorizationService.programSettingPrivilegesRoles

      if (
        extraData['settingType'] == 'Groups' &&
        pPrivileges['program_setting_groups'] &&
        pPrivileges['program_setting_groups'].includes(permissionHash[salut])
      ) {
        return true
      } else if (
        extraData['settingType'] == 'Contracts' &&
        pPrivileges['program_setting_contracts'] &&
        pPrivileges['program_setting_contracts'].includes(permissionHash[salut])
      ) {
        return true
      } else if (
        extraData['settingType'] == 'Vehicles' &&
        pPrivileges['program_setting_contract_vehicles'] &&
        pPrivileges['program_setting_contract_vehicles'].includes(permissionHash[salut])
      ) {
        return true
      } else if (
        extraData['settingType'] == 'Projects' &&
        pPrivileges['program_setting_projects'] &&
        pPrivileges['program_setting_projects'].includes(permissionHash[salut])
      ) {
        return true
      } else if (
        extraData['settingType'] == 'Users' &&
        pPrivileges['program_setting_users_roles'] &&
        pPrivileges['program_setting_users_roles'].includes(permissionHash[salut])
      ) {
        return true
      }
    }

    return false
  },
  findFacilityProjectId: (programId, projectId) => {
    let arr = AuthorizationService.projectFacilityHash[programId]
    let facilityProjectId = ''
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].facilityId == projectId) {
        facilityProjectId = arr[i].facilityProjectId
        break
      }
    }
    return facilityProjectId
  }
}

export default AuthorizationService
