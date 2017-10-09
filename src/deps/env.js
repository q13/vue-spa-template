/**
 * App环境预设
 */
import 'babel-polyfill';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import Channel from '../plugins/channel';
import Mapping from '../plugins/mapping';
Vue.use(Channel);
Vue.use(Mapping);
Vue.use(VueRouter);
Vue.use(Vuex);
const { mapMutations, mapGetters, mapActions, mapState } = Vuex;
export {
  Vue,
  VueRouter,
  Vuex,
  mapMutations,
  mapGetters,
  mapActions,
  mapState
}
