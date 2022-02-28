<template>
  <v-app>
    <v-main>
      <v-app-bar
      color="#6A76AB"
      dark
      elevate-on-scroll
      scroll-target="#scrolling-techniques-7"
      >
        <v-app-bar-title to="/">Canonical</v-app-bar-title>
        <v-btn-toggle dark v-model="toggle_exclusive">
          <v-btn to="/product">
            Product
          </v-btn>
          <v-btn to="/user">
            User
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn to="/about">
            About
          </v-btn>
          <v-btn to="/help">
            Help
          </v-btn>
          <v-btn to="/Login">
            Login
          </v-btn>

        </v-btn-toggle>
      </v-app-bar>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    toggle_exclusive: 0,
  }),
}
</script>
