/**
 * App component
 */
import { 
  VueRouter,
  Vuex
} from '../deps/env';
import {
  init as initSitmap
} from '../deps/sitmap';
import {
  init as initStore
} from '../deps/store';
import {
  c2s
} from '../deps/utils';
import template from './template';
import AppNavigation from '../modules/app-navigation/index';

// 初始化sitmap
const sitmap = initSitmap();
const router = new VueRouter({
  routes: sitmap.routes
});
// 初始化vuex
const store = new Vuex.Store(initStore());

// console.log('sitmap', sitmap);
export default {
  name: 'app',
  template,
  router,
  store,
  created: function () {
    console.log('$store', this.$store);
    console.log('$router', this.$router);
  },
  data() {
    return {
      navs: sitmap.navs,
      channel1: ['fff', 'aaa'],
      channel2: 'aaa'
    };
  },
  components: {
    AppNavigation
  }
};
