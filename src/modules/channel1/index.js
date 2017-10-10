export default {
  template: '<div style="border: 1px solid #000000; border-radius: 128px; width: 128px; height: 128px; line-height: 128px; text-align: center; display: inline-block; margin-right: 16px;">Channel1({{ channel }})</div>',
  created: function () {
    setTimeout(() => {
      console.log('Channel1 message send');
      this.$emit('::', 'Channel1 message.')
    }, 2000);
  }
};
