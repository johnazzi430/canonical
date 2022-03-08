import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import 'vuetify/dist/vuetify.min.css'
import store from './store/index';
import VueGtag from "vue-gtag";

import 'vue-multiselect/dist/vue-multiselect.css';

loadFonts()

createApp(App)
  .use(router)
  .use(vuetify)
  .use(store)
  .use(VueGtag, {
    config: { id: "G-C3BP9PBDB0" },
    params: { anonymize_ip: true },
    router
  })
  .mount('#app')
