import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/Home'
import Search from './components/Search'
import Detail from './components/MovieDetail.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    },
    {
      path: '/search/:movie_id',
      name: 'detail',
      component: Detail
    }
  ]
})