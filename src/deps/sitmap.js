// @flow
/**
 * 定义网站功能地图和路由配置信息
 * 层层引用，分散管理
 */
import demoParent from '../pages/welcome/demo-parent/sitmap';

function addUid(records: any) {
  const loop = function (records, baseIndex = '') {
    records.forEach((record, index) => {
      const uid = (baseIndex !== '' ? (baseIndex + '-' + index) : index) + '';
      record.uid = uid;
      record.route.uid = uid;
      if (record.children && record.children.length) {
        loop(record.children, uid);
      }
    });
  };
  loop(records);
  console.log(records);
  return records;
}
function extractRoutes(records: any) {
  var routes = [];
  records.forEach((record) => {
    if (record.route) {
      let route = {
        ...record.route
      };
      if (record.children && record.children.length) {
        const childrenRoutes = extractRoutes(record.children);
        if (childrenRoutes && childrenRoutes.length) {
          route.children = childrenRoutes;
        }
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
          const uids = record.uid.split('-');
          let parentRecords = all;
          return uids.reduce((pv, cv) => {
            const currentRecord = parentRecords[cv];
            if (currentRecord.children && currentRecord.children.length) {
              parentRecords = currentRecord.children;
            }
            if (currentRecord.route) {
              if (pv) {
                return pv + '/' + currentRecord.route.path;
              } else {
                return currentRecord.route.path;
              }
            } else {
              return pv;
            }
          }, '');
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
 * 初始化sitmap
 */
export function init() {
  const records = [{
    isCache: false, // 是否被缓存
    navText: 'Welcome', // 导航文字
    navLink: '', // 导航链接
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
    routes: extractRoutes(records),
    navs: extractNavs(records, records),
    records: records
  };
};

export function getSitmapConfigByUid() {}
