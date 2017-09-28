import demoChild from './demo-child/sitmap';

export default {
  isCache: false, // 是否被缓存
  navText: 'Demo-parent', // 导航文字
  navLink: '', // 导航链接
  navVisible: true, // 导航是否可见
  permission: 'all', // 权限控制，无具备权限将会被筛选掉
  route: {
    path: 'demo-parent',
    component: () => import('./index.vue')
  },
  children: [
    demoChild
  ]
};
