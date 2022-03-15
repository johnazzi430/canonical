import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import 'vuetify/dist/vuetify.min.css'
import store from './store/index';
import VueGtag from "vue-gtag";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

import 'vue-multiselect/dist/vue-multiselect.css';

loadFonts()

const app = createApp(App)
  .use(router)
  .use(vuetify)
  .use(store)
  .use(dayjs)
  .use(VueGtag, {
    config: { id: "G-C3BP9PBDB0" },
    params: { anonymize_ip: true },
    router
  })

app.config.globalProperties.$dayjs = dayjs

app.mount('#app')
