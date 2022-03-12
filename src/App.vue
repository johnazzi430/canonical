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

        <v-menu
        class="user-menu"
        offset-overflow
        left
        close-on-content-click>
            <template v-slot:activator="{ props }">
              <v-avatar
                  size="32"
                  color="black"
                  v-if='$store.state.user.loggedIn === true'
                  v-bind="props">
                <span
                  class="white--text text-h5">
                  {{$store.state.user.email[0].toUpperCase()}}</span>
                </v-avatar>
            </template>
            <v-list density="compact" variant="plain">
              <v-list-item>
                <p class="text-medium-emphasis">Signed in as</p>
              </v-list-item>
              <v-list-item>
                <p>{{$store.state.user.email.split("@")[0]}}</p>
              </v-list-item>
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

      </v-app-bar>
      <router-view/>
      <div class="alert-bar">
        <v-alert
          v-for="alert in alerts.filter(a => a.show === true)"
          :key="alert"
          border="start"
          closable
          close-label="Close Alert"
          :type="alert.type"
          :title="alert.message + ' ' + new Date(alert.time).toISOString()"
        />
      </div>

    </v-main>
  </v-app>
</template>

<script>
import {User} from "./services/firebaseDataService";

export default {
  name: 'App',
  data: () => ({
    toggle_exclusive: 0,
    alerts:[]
  }),
  beforeCreate() {
    this.$store.commit('enter')
  },
  methods: {
    logout(){
      User.logout()
    }
  },
  watch:{
    alerts_:{
      handler(){
        this.alerts = this.alerts_
      },
      deep: true,
    }
  },
  computed:{
    alerts_(){
      return this.$store.state.globalAlerts
    }
  }
}
</script>

<style lang="scss">

.v-field__input {
  font-size: 14px !important;
}

.v-input{
  margin-bottom:-30px;
}

.user-menu{
   .v-overlay__content{
    right: 0px !important;
    left: auto !important;
    border: solid thin lightgrey;
    width: 158px;
  }
}

.v-avatar{
  margin:4px;
}

.alert-bar{
  bottom: 0px;
  position: fixed;
  width:100%;
  z-index:1000;
}

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
