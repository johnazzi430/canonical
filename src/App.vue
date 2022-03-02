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
          <div v-if='$store.state.user.loggedIn === true'>
            {{$store.state.user.email}}
          </div>
          <v-btn variant="contained-text" to="/about">
            About
          </v-btn>
          <v-btn variant="contained-text" to="/help">
            Help
          </v-btn>
          <v-btn variant="contained-text" v-if='$store.state.user.loggedIn === false' to="/Login">
              Login
          </v-btn>
          <v-btn variant="contained-text" v-else-if='$store.state.user.loggedIn === true' @click="logout">
              Logout
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
