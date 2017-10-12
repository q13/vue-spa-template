var path = require('path')
let argvs = {}
process.argv.slice(2).forEach(arg => {
  let arr = (arg || '').split('=')
  argvs[arr[0]] = arr[1]
})
let { proxy, port } = argvs

module.exports = {
  build: {
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: '/',
    assetsPublicPath: '/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    // productionGzip: false,
    // productionGzipExtensions: ['js', 'css']
  },
  dev: {
    port: port || 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: '/',
    assetsPublicPath: '/',
    // 如需代理，在此处填写
    // `npm run dev -- proxy=127.0.0.1`
    proxyTable: proxy
      ? {
        '*': {
          target: proxy
        }
      } 
      // 自行配置在此处
      : {},
    cssSourceMap: true
  }
}
