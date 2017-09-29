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
      <chart :options="pie" ref="pie" auto-resize></chart>
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
  import { mapMutations, mapGetters } from '../../deps/env.js';
  import 'ya-ui-vue/pc/button';
  import 'ya-ui-vue/pc/dialog';
  import 'ya-ui-vue/pc/chart';
  import 'echarts/lib/chart/bar';
  import 'echarts/lib/chart/pie';
  import 'ya-ui-vue/mobile/button';
  export default {
    data: function () {
      return {
        text: 'Welcome',
        channelName: 'a',
        pie: {
          title: {
            text: '饼图程序调用高亮示例',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                {value: 335, name: '直接访问'},
                {value: 310, name: '邮件营销'},
                {value: 234, name: '联盟广告'},
                {value: 135, name: '视频广告'},
                {value: 1548, name: '搜索引擎'}
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
      };
    },
    components: {
      Channel1,
      Channel2
    },
    computed: Object.assign({}, mapGetters([
      'appProp1_'
    ])),
    methods: Object.assign({
      welcomeHere: function () {
        alert(3);
      }
    }, mapMutations([
      'appProp1Increment'
    ])),
    mounted: function () {
      this.welcomeHere();
      // this.appProp1Increment();
    }
  }
</script>