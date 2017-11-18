import { restrictToAuthenticated } from '@/router/guards'

import Homepage from '@/views/Homepage'
import Login from '@/views/Login'

export default [
  {
    path: '/',
    name: 'home',
    component: Homepage,
    beforeEnter: restrictToAuthenticated
  }, {
    path: '/login',
    name: 'login',
    component: Login
  }
]
