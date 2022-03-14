<template>
  <section id="firebaseui-auth-container"></section>
</template>

<script>
//import {User} from "../services/firebaseDataService";
import firebase from "../firebase";
import * as firebaseui from 'firebaseui'
import "firebaseui/dist/firebaseui.css";
import router from "../router"

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
  async mounted() {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      let ui = firebaseui.auth.AuthUI.getInstance();
      if (!ui) {ui = new firebaseui.auth.AuthUI(firebase.auth());}
      var uiConfig = {
            // signInSuccessUrl: "/",
            //autoUpgradeAnonymousUsers: true,
            signInFlow: 'popup',
            signInOptions: [
              {
                provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                customParameters: { prompt: 'select_account'}
              },
              firebase.auth.EmailAuthProvider.PROVIDER_ID,
              firebase.auth.GithubAuthProvider.PROVIDER_ID
            ],
            callbacks: {
              signInSuccessWithAuthResult: async function(){
//                await User.getUserAuth()
                router.back()
              }
            }
        };
      await ui.start("#firebaseui-auth-container", uiConfig);
      // User.getUserAuth()
      // this.$router.back()
    },
  methods: {
    // async login() {
    //   await User.login(this.form)
    //     .catch((error) => {
    //       this.error = true;
    //       this.errorMessage = error;
    //     });
    //   this.$router.back()
    // },
    //
    // clear(){
    //   this.$refs.form.reset()
    // },
    //
    // async loginWithGoogle(){
    //   await User.loginWithGoogle()
    //   this.$router.back()
    //   return
    // }

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
