import { createRouter, createWebHistory} from 'vue-router'
import Home from '@/components/Home.vue'
import Login from '../components/Login'
import Register from '../components/Register'
import Product from '../components/product/productMain'
import User from '../components/user/userMain'
import Draft from '../components/draft/draftView'

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
        { path: 'product/:id', component: Product},
        { path: 'feature/:id', component: Product},
        { path: 'idea/:id', component: Product},
        { path: 'goal/:id', component: Product},
        { path: 'risk/:id', component: Product},
      ]
  },
  {
    path: '/user',
    name: 'User',
    component: User,
    children:[
        { path: 'product/:id', component: User},
        { path: 'feature/:id', component: User},
        { path: 'idea/:id', component: User},
        { path: 'goal/:id', component: User},
        { path: 'risk/:id', component: User},
      ]
  },
  {
    path: '/draft',
    name: 'draft',
    component: Draft,
    children:[{ path: 'draft/:id', component: Draft}]
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
]

  const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
