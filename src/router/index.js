import { createRouter, createWebHistory} from 'vue-router'
import Home from '@/components/Home.vue'
import Login from '../components/Login'
import Register from '../components/Register'
import Product from '../components/product/productMain'
import User from '../components/user/userMain'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/product',
    name: 'Product',
    component: Product
  },
  {
    path: '/user',
    name: 'User',
    component: User
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
