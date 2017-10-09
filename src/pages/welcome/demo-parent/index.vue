<template>
  <div>{{ text2 }}
    <div style="border: 1px solid #000000; padding: 8px;">
      <router-view></router-view>
    </div>
    <input type="text" />
  </div>
</template>
<script>
  export default {
    data: function () {
      return {
        text2: 'Demo parent'
      };
    }
  }
</script>