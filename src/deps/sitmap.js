// @flow
/**
 * 定义网站功能地图和路由配置信息
 * 层层引用，分散管理
 */
import {
  Vue
} from './env';
import {
  camelCase,
  upperFirst
} from 'lodash';
import raf from 'raf';
import store from './store';

import demoParent from '../pages/welcome/demo-parent/sitmap';

function addUid(records: any) {
  const loop = function (records, baseIndex = '') {
    records.forEach((record, index) => {
      const uid = (baseIndex !== '' ? (baseIndex + '-' + index) : index) + '';
      record.uid = uid;
      record.route.uid = uid;
      if (record.route.meta) { // meta里存一份
        record.route.meta.uid = uid;
      } else {
        record.route.meta = { uid };
      }
      if (record.children && record.children.length) {
        loop(record.children, uid);
      }
    });
  };
  loop(records);
  console.log(records);
  return records;
}
function extractRoutes(records: any, all: any) {
  var routes = [];
  records.forEach((record) => {
    if (record.route) {
      let route = {
        ...record.route
      };
      let isCache = record.isCache; // 是否有缓存标识
      const pageName = getSemanticPageName(record, all);
      // 默认route param以props方式传递
      if (route.props === undefined) {
        route.props = true;
      }
      // 存储页面缓存名称
      if (isCache !== undefined) {
        if (isCache) {
          store.commit('cachePageAdd', pageName);
        }
      } else {
        // 默认带 :/?/# 特殊字符的路由页面会被缓存
        if (/[?|:|#]+/.test(route.path)) {
          store.commit('cachePageAdd', pageName);
          isCache = true;
        }
      }
      // 替换component
      let pageComponent = null;
      const RealComponent = route.component;
      const WrapperComponent = Vue.extend({
        name: pageName,
        mounted() {
          const $refs = this.$refs;
          let handler = raf(function tick() {
            if ($refs.index) {
              raf.cancel(handler);
              pageComponent = $refs.index;
            } else {
              handler = raf(tick);
            }
          });
        },
        render(h) {
          return h(RealComponent, {
            props: this.$attr,
            ref: 'index'
          });
        }
      });
      // 自定义route enter/update 进入行为
      const handleRouteChangeTo = (to) => {
        if (to.meta.uid === route.meta.uid) {
          store.commit('pageChange', WrapperComponent);
          if (pageComponent) { // route update操作
            // 调用routeUpdated回调
            const routeUpdated = pageComponent.$options.routeUpdated;
            routeUpdated && routeUpdated.call(pageComponent, to);
          }
        }
      };
      // 自定义route update/leave 离开行为
      const handleRouteChangeFrom = (from) => {
        if (from.meta.uid === route.meta.uid) {
          if (!isCache) {
            pageComponent = null; // 释放引用
          }
        }
      };
      // console.log('name', getSemanticPageName(record, all));
      // 伪造一个page component proxy.
      let FakeComponent = route.component = {
        beforeRouteEnter(to, from, next) {
          next();
          handleRouteChangeTo(to);
        },
        beforeRouteUpdate(to, from, next) {
          next();
          handleRouteChangeFrom(from);
          handleRouteChangeTo(to);
        },
        beforeRouteLeave(to, from, next) {
          next();
          handleRouteChangeFrom(from);
        },
        destroyed() {
        }
      };
      if (record.children && record.children.length) {
        const childrenRoutes = extractRoutes(record.children, all);
        if (childrenRoutes && childrenRoutes.length) {
          route.children = childrenRoutes;
        }
        // 设置带router-view的template
        FakeComponent.template = '<router-view></router-view>';
      } else {
        FakeComponent.template = '';
      }
      routes.push(route);
    }
  });
  return routes;
}
function extractNavs(records: any, all: any) {
  var navs = [];
  records.forEach((record) => {
    if (record.navVisible) {
      let nav: {
        text: string,
        link: string,
        children?: []
      } = {
        text: record.navText,
        link: record.navLink || (record.route && (() => {
          const familyRecords = getFamilyRecords(record, all);
          return '/' + familyRecords.filter((record) => {
            return record.route;
          }).map((record) => {
            return getClearPaths(record.route.path).join('/');
          }).join('/');
        })()) || ''
      };
      if (record.children && record.children.length) {
        const childrenNavs = extractNavs(record.children, all);
        if (childrenNavs && childrenNavs.length) {
          nav.children = childrenNavs;
        }
      }
      navs.push(nav);
    }
  });
  return navs;
}

/**
 * 查找record的所有parent记录
 * @param {Object} record 
 * @param {Array} records 
 */
function getFamilyRecords(record, records) {
  const uids = record.uid.split('-');
  let parentRecords = records;
  return uids.reduce((pv, cv) => {
    const currentRecord = parentRecords[cv];
    if (currentRecord.children && currentRecord.children.length) {
      parentRecords = currentRecord.children;
    }
    return pv.concat(currentRecord);
  }, []);
}

function getSemanticPageName(record, records) {
  const familyRecords = getFamilyRecords(record, records);
  return 'Page' + upperFirst(camelCase(familyRecords.filter((record) => {
    return !!record.route;
  }).map((record) => {
    return getClearPaths(record.route.path).join('-');
  }).join('-')));
}

function getClearPaths(path) {
  let paths = path.split('/');
  // filter掉空和参数字符串
  paths = paths.filter((frag, i) => {
    if (frag && /^[A-Za-z0-9]+$/.test(frag.charAt(0))) {
      return true;
    }
  });
  return paths;
}

/**
 * 初始化sitmap
 */
export function init() {
  const records = [{
    isCache: true, // 是否被缓存
    navText: 'Welcome', // 导航文字
    navLink: '/welcome', // 导航链接
    navVisible: true, // 导航是否可见
    permission: 'all', // 权限控制，无具备权限将会被筛选掉
    route: {
      path: '/welcome',
      component: () => import('../pages/welcome/index.vue')
    },
    children: [
      demoParent
    ]
  }];
  // Add side effect
  addUid(records);
  return {
    routes: extractRoutes(records, records),
    navs: extractNavs(records, records),
    records: records
  };
};

export function getSitmapConfigByUid() {}
