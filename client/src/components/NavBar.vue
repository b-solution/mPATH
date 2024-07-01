<script>
import { RouterLink, RouterView } from 'vue-router'
export default {
  components: {
    RouterLink,
    RouterView
  },
  data: () => ({

  }),
  watch: {
    // group() {
    //   this.drawer = false
    // },
  },
}
</script>

<template>
  <v-card>
    <v-layout>
      <v-app-bar prominent>
        <RouterLink to="/" class="no-underline text-dark">
          <img alt="Vue logo" class="logo ml-3" src="" width="165" />
        </RouterLink>
        <v-spacer></v-spacer>
        <nav>

          <RouterLink to="/admin" class="no-underline text-dark mr-2">
            <v-icon>mdi-folder-wrench-outline</v-icon>
            Admin Panel
          </RouterLink>

          <RouterLink to="/help" class="no-underline text-dark mr-2">
            <v-icon>mdi-help</v-icon>
            Help
          </RouterLink>
          <RouterLink to="/logout" class="no-underline text-dark pr-1">
            <v-icon>mdi-logout</v-icon>
            Logout
          </RouterLink>
          <RouterLink to="/profile" class="no-underline text-dark mr-2">
            <v-avatar size="36px">
              <!-- <v-img
                v-if="message.avatar"
                alt="Avatar"
                src="https://randomuser.me/api/portraits/women/85.jpg"
              ></v-img>
              <v-icon
                v-else
                :color="message.color"
                :icon="message.icon"
              ></v-icon>            
            -->
              <v-img src="https://randomuser.me/api/portraits/women/85.jpg" title="Sandra Adams"></v-img>
            </v-avatar>
          </RouterLink>


        </nav>

      </v-app-bar>
      <!-- <v-navigation-drawer
        expand-on-hover
        rail
      >
        <v-list>
            <RouterLink to="/profile" class="no-underline text-dark">
          <v-list-item
            prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
            title="Sandra Adams"
           
          ></v-list-item>
          </RouterLink>
        </v-list>
      
        <v-divider></v-divider>

        <v-list density="compact" nav>
         <RouterLink to="/admin_panel"  class="no-underline text-dark"> 
            <v-list-item prepend-icon="mdi-folder-wrench-outline" title="Admin Panel" value="myfiles" color="text" class="no-underline"></v-list-item>
        </RouterLink>
          <v-list-item prepend-icon="mdi-help-circle-outline" title="Help" value="shared" color="text" class="no-underline"></v-list-item>
          <v-list-item prepend-icon="mdi-logout" title="Logout" value="starred"  color="text" class="no-underline"></v-list-item>
        </v-list>
      </v-navigation-drawer> -->
      <v-main style="height: 100vh;">
        <RouterView />
      </v-main>
    </v-layout>
  </v-card>
  <!-- <RouterView />  -->
</template>

<style scoped lang="scss">
.text-dark {
  color: #383838;
}
</style>