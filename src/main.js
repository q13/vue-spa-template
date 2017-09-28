// @flow
import { Vue } from './deps/env'
// import Vuex from 'vuex'
// import R from 'ramda'
import App from './app/index'
new Vue({
  el: '#app',
  render: h => h(App)
})
