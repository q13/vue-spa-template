/**
 * App导航模块
 */
export default {
  name: 'app-navigation',
  props: {
    navs: Array
  },
  data: function () {
    return {
    };
  },
  template: `
    <ul>
      <li v-for="(item, index) in navs">
        <div class="nav-content">
          <router-link :to="item.link">{{ item.text }}</router-link>
        </div>
        <div class="nav-children" v-if="item.children && item.children.length">
          <app-navigation :navs="item.children"></app-navigation>
        </div>
      </li>
    </ul>
  `
};
