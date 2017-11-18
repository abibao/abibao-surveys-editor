import { restrictToAuthenticated } from '@/router/guards'

import Homepage from '@/views/Homepage'
import Login from '@/views/Login'
import Campaigns from '@/views/Campaigns'

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
  }, {
    path: '/campaigns',
    name: 'campaigns',
    component: Campaigns,
    beforeEnter: restrictToAuthenticated
  }
]
