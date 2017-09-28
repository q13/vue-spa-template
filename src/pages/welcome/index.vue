<template>
  <div>{{ text }}
    <div style="padding: 8px;">
      <channel1 :channel="['a']"></channel1>
      <channel1 :channel="channelName"></channel1>
      <channel2 :channel="channelName" v-mapping:welcomeHere="'channel2Method'"></channel2>
    </div>
    <div>
      <el-button>Default Button</el-button>
      <mt-button>Default Button</mt-button>
    </div>
    <div>
      {{ appProp1_ }}
    </div>
    <div style="border: 1px solid #000000; padding: 8px;">
      <router-view class="welcome"></router-view>
    </div>
  </div>
</template>
<script>
  import Channel1 from '../../modules/channel1/index.js';
  import Channel2 from '../../modules/channel2/index.js';
  import 'ya-ui-vue/pc/button';
  import 'ya-ui-vue/pc/dialog';
  import 'ya-ui-vue/mobile/button';
  import { mapMutations, mapGetters } from '../../deps/env.js';
  export default {
    data: function () {
      return {
        text: 'Welcome',
        channelName: 'a'
      };
    },
    components: {
      Channel1,
      Channel2
    },
    computed: Object.assign({}, mapGetters([
      'appProp1_'
    ])),
    methods: Object.assign({}, mapMutations([
      'appProp1Increment'
    ])),
    mounted: function () {
      // this.welcomeHere();
      // this.appProp1Increment();
    }
  }
</script>