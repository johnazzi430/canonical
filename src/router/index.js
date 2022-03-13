import { createRouter, createWebHistory} from 'vue-router'
import Home from '@/components/Home.vue'
import Login from '../components/Login'
import Register from '../components/Register'
import Product from '../components/product/productMain'
import UserC from '../components/user/userMain'
import Draft from '../components/draft/draftView'
import {User} from "../services/firebaseDataService";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/product',
    name: 'Product',
    component: Product,
    children:[
        {
          path: 'product/:id',
          component: Product,
          props: (route) => ({ draft: route.query.draft })
      },
        { path: 'feature/:id', component: Product},
        { path: 'idea/:id', component: Product},
        { path: 'goal/:id', component: Product},
        { path: 'risk/:id', component: Product},
      ]
  },
  {
    path: '/user',
    name: 'User',
    component: UserC,
    children:[
        { path: 'persona/:id', component: UserC},
        { path: 'need/:id', component: UserC},
        { path: 'insight/:id', component: UserC},
        { path: 'journey/:id', component: UserC},
        { path: 'jobToBeDone/:id', component: UserC},
        { path: 'interview/:id', component: UserC},
      ]
  },
  {
    path: '/draft',
    name: 'draft',
    component: Draft,
    children:[{ path: ':id', component: Draft}]
  },
  {
    path: '/about',
    name: 'About',
    component: Home
  },
  {
    path: '/help',
    name: 'Help',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/logout',
    name: 'logout',
    component: () => {
      User.logout();
      this.$store.commit('logout')
      this.$router.push('/')
    }
  },
]

  const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
