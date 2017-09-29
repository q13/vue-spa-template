import Channel1 from '../channel1/index';
export default {
  template: '<div style="border: 1px solid #000000; border-radius: 128px; width: 128px; height: 128px; line-height: 128px; text-align: center; display: inline-block; margin-right: 16px; white-space: nowrap;">Channel2({{ channel }})&nbsp;&nbsp;Received：{{ data }}</div>',
  created: function () {
    this.$chan(Channel1).on((data) => {
      console.log('Channel2 received', data);
      this.data = data;
    })
    this.addDeprecatedApi({
      oldName: 'channel2Method',
      newName: 'channel3Method',
      description: 'fjewifiewfiew'
    });
  },
  data: function () {
    return {
      data: ''
    };
  },
  methods: {
    channel3Method: function () {
      alert(1);
    }
  }
};
