// @flow
/**
 * 基于vuex的状态管理仓库
 */
import demoParent from '../pages/welcome/demo-parent/store';
export function init() {
  return {
    state: {
      appProp1: 1,
      appProp2: 2
    },
    getters: {
      appProp1_: (state: any) => {
        return state.appProp1;
      }
    },
    actions: {},
    mutations: {
      appProp1Increment(state: any) {
        state.appProp1++;
      }
    },
    modules: {
      demoParent
    }
  };
};
