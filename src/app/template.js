export default `
  <div id="app">
    <div class="app-header" style="border: 1px solid #000000;">
      <app-navigation :navs="navs"></app-navigation>
    </div>
    <div class="app-body" style="border: 1px solid #000000; margin-top: 8px; padding: 8px;">
      <router-view></router-view>
    </div>
  </div>
`
