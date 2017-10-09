// @flow
/**
 * 基于vuex的状态管理仓库
 */
import {
  Vuex
} from './env';

import demoParent from '../pages/welcome/demo-parent/store';
export function init() {
  return {
    state: {
      activePage: null, // 存储当前激活page
      cachePages: [] // 保存被缓存的page name
    },
    getters: {
    },
    actions: {},
    mutations: {
      pageChange(state: any, activePage: any) {
        state.activePage = activePage;
      },
      cachePageAdd(state: any, pageName: string | string[]) {
        let cachePages = state.cachePages;
        const pageNames = [].concat(pageName);
        pageNames.forEach((pageName) => {
          if (!cachePages.some((value) => {
            return value === pageName;
          })) {
            cachePages.push(pageName);
          }
        });
      }
    },
    modules: {
      demoParent
    }
  };
};
export default new Vuex.Store(init());
