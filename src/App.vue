<template>
  <v-app>
    <v-main>
      <v-app-bar
      color="#6A76AB"
      dark
      elevate-on-scroll
      scroll-target="#scrolling-techniques-7"
      >
        <v-app-bar-title><v-btn variant="plain" to="/"> Canonical</v-btn></v-app-bar-title>
        <v-btn-toggle dark v-model="toggle_exclusive">
          <v-btn dark variant="contained-text" to="/product">
            Product
          </v-btn>
          <v-btn dark variant="contained-text" to="/user">
            User
          </v-btn>
          <v-spacer></v-spacer>
          <v-menu
          :close-on-content-click='true'>
              <template v-slot:activator="{ props }">
                <v-avatar
                    color="black"
                    v-if='$store.state.user.loggedIn === true'
                    v-bind="props">
                  <span
                    class="white--text text-h5">
                    {{$store.state.user.email[0].toUpperCase()}}</span>
                  </v-avatar>
              </template>
              <v-list density="compact" variant="plain">
                <v-list-item
                  v-for="(item, index) in ['logout']"
                  :key="index"
                  variant="plain"
                >
                  <v-list-item-title variant="contained-text" v-if='$store.state.user.loggedIn === true' @click="logout">
                      Logout
                  </v-list-item-title>
                </v-list-item>
              </v-list>
          </v-menu>
          <!-- <v-btn variant="contained-text" to="/about">
            About
          </v-btn>
          <v-btn variant="contained-text" to="/help">
            Help
          </v-btn> -->
          <v-btn variant="contained-text" v-if='$store.state.user.loggedIn === false' to="/Login">
              Login
          </v-btn>

        </v-btn-toggle>
      </v-app-bar>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import {User} from "./services/firebaseDataService";

export default {
  name: 'App',
  data: () => ({
    toggle_exclusive: 0,
  }),
  methods: {
    logout(){
      User.logout()
    }
  }
}
</script>

<style>
/* width */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
