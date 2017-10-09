/**
 * App component
 */
import { 
  VueRouter,
  Vuex,
  mapState
} from '../deps/env';
import {
  init as initSitmap
} from '../deps/sitmap';
import store, {
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
// const store = new Vuex.Store(initStore());

// console.log('sitmap', sitmap);
export default {
  name: 'app',
  template,
  router,
  store,
  data() {
    return {
      navs: sitmap.navs,
      channel1: ['fff', 'aaa'],
      channel2: 'aaa'
    };
  },
  computed: {
    // activePage() {
    //   return null;
    // }
    ...mapState({
      activePage: state => state.activePage,
      cachePages(state) {
        const cachePages = state.cachePages;
        if (!cachePages.length) {
          return '_'; // 占位，否则include为空默认缓存全部，WTF
        }
        return cachePages.join(',');
        // return new RegExp('(?!' + cachePages.map(pageName => '.*' + pageName).join('|') + ')^.*$');
      }
    })
  },
  components: {
    AppNavigation
  },
  created: function () {
    console.log('$store', this.$store);
    console.log('$router', this.$router);
  }
};
