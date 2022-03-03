<template>
  <div class="container center">
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >

      <v-text-field
        v-model="form.email"
        :rules="[rules.email]"
        label="E-mail"
        required
        :error='error ? true: false'
      ></v-text-field>

      <v-text-field
        v-model="form.password"
        label="Password"
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="[rules.required, rules.min]"
        :type="show1 ? 'text' : 'password'"
        @click:append="show1 = !show1"
        required
        :error='error ? true: false'
      ></v-text-field>

      <v-alert
        v-model="error"
        type="error"
        closable
        close-label="Close Alert">{{errorMessage}}</v-alert>

      <v-btn
        color="success"
        class="mr-4"
        @click="login"
      >
        Login
      </v-btn>
      <v-btn
        class="mr-4"
        @click="loginWithGoogle"
      >
        Login with google
      </v-btn>

      <v-btn
        color="error"
        class="mr-4"
        @click="clear"
      >
        Clear Form
      </v-btn>

      <v-btn
        color="warning"
        to="/register"
      >
        Register
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import {User} from "../services/firebaseDataService";

export default {
  data() {
    return {
      valid: true,
      show1: false,
      form: {
        email: "",
        password: ""
      },
      rules: {
        email: v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
        emailMatch: () => (`The email and password you entered don't match`)
      },
      error: null,
      errorMessage: null
    };
  },
  methods: {
    async login() {
      await User.login(this.form)
        .catch((error) => {
          this.error = true;
          this.errorMessage = error;
        });
//      this.$router.replace({ path: '/' })
    },

    clear(){
      this.$refs.form.reset()
    },

    async loginWithGoogle(){
      await User.loginWithGoogle()
      //// TODO: fix this
      this.$router.push(this.$route.query.from);
      return
    }

  }
};
</script>

<style scoped>
.center {
  margin: auto;
  margin-top: 88px;
  width: 50%;
  border: 3px solid green;
  padding: 10px;
}
</style>
