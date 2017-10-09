export default `
  <div id="app">
    <div class="app-header" style="border: 1px solid #000000;">
      <app-navigation :navs="navs"></app-navigation>
    </div>
    <div class="app-body" style="border: 1px solid #000000; margin-top: 8px; padding: 8px;">
      <keep-alive :include="cachePages">
        <component :is="activePage">
          <!-- inactive components will be cached! -->
        </component>
      </keep-alive>
    </div>
    <router-link to="/welcome/1">Welcome1</router-link>
    <router-link to="/welcome/2">Welcome2</router-link>
    <router-view></router-view>
  </div>
`
