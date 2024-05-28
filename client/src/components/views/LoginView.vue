<template>
  <div>
    <div class="container"></div>
    <div class="login-wrapper signin-section">
      <div class="row d-flex justify-content-center">
        <div class="form-signin mg-btm">
          <h3 class="heading-desc text-center">
            <a class="navbar-brand" href="/"
              ><img
                src="/assets/microhealthllc.png"
            /></a>
          </h3>
          <div class="social-box pb-5 p-4">
            <div class="row mg-btm">
              <div class="col-md-12">
                <form class="button_to" method="post" action="/users/auth/google_oauth2">
                  <button class="btn btn-danger btn-block" type="submit">
                    Continue with Google</button
                  ><input
                    type="hidden"
                    name="authenticity_token"
                    value="vJvU-wzzrC49T_n1gI761ZAN4uYJVqknDfnj3qiDGsasfNB-hdqtAyHTk71IZ4T9FHC7vZ0c5ISJrcZovQ88nQ"
                    autocomplete="off"
                  />
                </form>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <form class="button_to" method="post" action="/users/auth/office365">
                  <button class="btn btn-info btn-block" type="submit">
                    Continue with Office 365</button
                  ><input
                    type="hidden"
                    name="authenticity_token"
                    value="K7Dy_hL-MPJEMyV6Avyj632eR-ew3hYGJ2cwmLwmoxq1TFH6EGeFb-5jX7IiBwSkAUVB95s-v03TzIMqSK893A"
                    autocomplete="off"
                  />
                </form>
              </div>
            </div>
          </div>
          <form
            class="new_user"
            id="new_user"
            action="/users/sign_in"
            accept-charset="UTF-8"
            method="post"
            @submit.prevent="login"
          >
            <input
              type="hidden"
              name="authenticity_token"
              value="sOa5PGj45KJ4D3Ud2exSbyVvPsDQPtAhotLNlYWAjRRx3DkDZ5kWD1bOpOSm0dOz3DI6HW9V9lY_BYAuUWMajA"
              autocomplete="off"
            />
            <div class="text-danger mb-1 alert alert-alert">
              <a href="#" data-dismiss="alert" class="close">×</a>
              You need to sign in before continuing.
            </div>
            <div class="form-group mt-4 px-4">
              <label for="user_email">Email</label
              ><input
                autofocus="autofocus"
                autocomplete="email"
                class="form-control"
                placeholder="user@example.com"
                data-cy="user_email"
                type="email"
                value=""
                name="user[email]"
                id="user_email"
                v-model="username"
              /><br /><label for="user_password">Password</label
              ><input
                autocomplete="off"
                class="form-control"
                placeholder="password"
                data-cy="user_password"
                type="password"
                name="user[password]"
                id="user_password"
                v-model="password"
              />
              <div class="form-group mt-3">
                <div class="form-check">
                  <input
                    name="user[remember_me]"
                    type="hidden"
                    value="0"
                    autocomplete="off"
                  /><input
                    class="form-check-input"
                    data-cy="user_remember_me"
                    type="checkbox"
                    value="1"
                    name="user[remember_me]"
                    id="user_remember_me"
                  /><label for="user_remember_me">Remember me</label>
                </div>
              </div>
              <span class="clearfix"></span>
            </div>
            <div class="login-footer p-4">
              <div class="row">
                <div class="col-xs-6 col-md-6">
                  <div class="left-section">
                    <a href="/users/password/new">Forgot your password?</a><br />
                  </div>
                </div>
                <div class="col-xs-6 col-md-6 pull-right">
                  <input
                    type="submit"
                    name="commit"
                    value="Login"
                    class="btn btn-large btn-danger pull-right"
                    data-cy="submit"
                    data-disable-with="Login"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
import axios from "axios";
import { mapGetters, mapMutations } from "vuex";
import AuthorizationService from '../../services/authorization_service.js'
import { API_BASE_PATH } from '../../mixins/utils'

export default {
  name: 'LoginView',
  props: ['facility'],
  components: {},
  data: () => {
    return {
      username: "",
      password: "",
    };
  },
  mounted() {
    console.log("LoginView Mounted", this.isLoggedIn)
    if(this.isLoggedIn){
      // console.log("LoginView Mounted", this.isLoggedIn)
      this.$router.push({ name: 'ProgramListView' })
    }    
  },
  computed: {
    ...mapGetters(["isLoggedIn"]),
  },
  methods: {
    ...mapMutations(["setContentLoaded","setUser", "setToken", "setPreferences", "setProgramAdminRole", "setProjectFacilityHash"]),
    async login(e) {
      e.preventDefault();

        axios({
          method: "POST",
          url:  `${API_BASE_PATH}/auth/users/sign_in`,
          data: {
            email: this.username,
            password: this.password,
          },
          headers: {
            "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]')
              .attributes["content"].value,
          },
        })
        .then((response) => {
          console.log("AuthResponse", response)
            AuthorizationService.current_user = response.data.current_user //JSON.parse(current_user.replace(/&quot;/g, '"'))
            AuthorizationService.token = response.data.token
            localStorage.setItem('token', response.data.token);
            AuthorizationService.refreshToken = response.data.refreshToken
            this.setUser( AuthorizationService.current_user);
            this.setToken(AuthorizationService.token);

            // this.setContentLoaded(true)
            this.$router.push({ name: 'ProgramListView' })

        })
        .catch((err) => {
          console.log("Error", err);
          this.errorTrue = true
        })
        .finally(() => {
          this.loading = false;
        });


    }
  }
}
</script>

<style></style>
