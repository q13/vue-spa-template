// @flow
import axios from 'axios';
import {
  Vue
} from './env';
// import {
//   mergeDeepRight
// } from 'ramda';

const BASE_PATH = '/';
const c2s = (() => {
  var ajaxSources = []; // 存储ajax取消token存储
  return (ajaxOptions: any, {
    mask = true,
    ajaxType = 'ignore', // 防止二次提交 ignore(等上次请求完才能发请求)/abort(直接中断上次请求)/none(可发多个相同请求)
    withData = true, // 在ajaxType不等于none时起作用
    autoApplyUrlPrefix = true, // 自动附加请求前缀
    silentError = false // 默认提示错误
  }: any = {}) => {
    if (autoApplyUrlPrefix) {
      ajaxOptions.url = BASE_PATH + ajaxOptions.url;
    }
    // 默认post方式
    ajaxOptions.method = ajaxOptions.method || 'post';
    // 返回值默认json
    ajaxOptions.responseType = ajaxOptions.responseType || 'json';
    // ajaxOptions.headers = {
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // }
    // data过滤string参数类型的前后空格
    // const data = mergeDeepRight({
    //   header: {
    //     action: ajaxOptions.method,
    //     user: '',
    //     token: '',
    //     fields: [],
    //     sort: [],
    //     filter: []
    //   },
    //   body: {
    //   }
    // }, ajaxOptions.data || {});
    let data: {
      header: any,
      body: any
    } = ajaxOptions.data || {
      header: null,
      body: null
    };
    data.header = {
      action: ajaxOptions.method,
      user: '',
      token: '',
      fields: [],
      sort: [],
      filter: [],
      ...(data.header || {})
    };
    data.body = data.body || {};
    const dataMainKeys = ['header', 'body'];
    dataMainKeys.forEach((k) => {
      data[k] = Object.keys(data[k]).reduce((pv, cv) => {
        let value = data[k][cv]
        if (typeof value === 'string') {
          value = value.trim()
        }
        pv = {
          ...pv,
          [cv]: value
        }
      }, {});
    });
    let maskElement = null;
    let isRefStatic = false;
    let refElement = null;
    const cancelSource = axios.CancelToken.source();
    // 遮罩处理
    if (mask === true) { // 全局遮罩共用一个遮罩
      maskElement = document.getElementById('app-ajax-global-mask');
      if (!maskElement) {
        maskElement = document.createElement('div');
        maskElement.id = 'app-ajax-global-mask';
        maskElement.className = 'app-ajax-mask app-ajax-global-mask';
        maskElement.style.display = 'none';
        maskElement.style.position = 'fixed';
        maskElement.style.top = '0';
        maskElement.style.left = '0';
        maskElement.style.width = '100%';
        maskElement.style.height = '100%';
        // maskElement.style.background = 'red';
        maskElement.innerHTML = '<div class="app-ajax-mask-inner"></div>';
        if (document.body) { // Fuck flow
          document.body.appendChild(maskElement);
        }
      }
    } else if (mask instanceof Vue) { // 局部遮罩，要求root element拥有定位，否则给予警告
      refElement = mask.$el;
      const style = window.getComputedStyle(refElement);
      if (style.position === 'static') {
        console.warn('被定位element position === static，数据请求过程中可能会产生布局错乱');
        refElement.style.position = 'relative';
        isRefStatic = true;
      }
      maskElement = document.createElement('div');
      maskElement.className = 'app-ajax-mask app-ajax-part-mask';
      maskElement.style.display = 'none';
      maskElement.style.position = 'absolute';
      maskElement.style.width = refElement.offsetWidth;
      maskElement.style.height = refElement.offsetHeight;
      refElement.appendChild(maskElement);
      // 关联vue component，destroy后abort请求
      mask.$once('destroyed', () => {
        cancelSource.cancel('abort');
      })
    }
    if (maskElement) {
      maskElement.style.display = 'block';
    }
    // 重复请求处理
    ajaxOptions.cancelToken = cancelSource.token;
    if (ajaxType === 'abort' || ajaxType === 'ignore') {
      let isIgnore = false;
      ajaxSources.some((source) => {
        if (ajaxOptions.url === source.url &&
          (!withData || (withData && JSON.stringify(ajaxOptions.data) === JSON.stringify(source.data)))) { // 带请求参数判定和不带请求参数判定
          if (ajaxType === 'abort') {
            source.cancel('abort');
          } else {
            isIgnore = true;
          }
          return true;
        }
      })
      if (isIgnore) { // 需要等待的请求直接返回，不做任何操作
        return;
      }
    }
    // 存储ajax资源
    ajaxSources.push({
      cancel: cancelSource.cancel,
      url: ajaxOptions.url,
      data: ajaxOptions.data,
      cancelToken: ajaxOptions.cancelToken
    });
    // 清理ajax source
    const clearAjaxSource = function () {
      ajaxSources = ajaxSources.filter((source) => {
        return source.cancelToken !== ajaxOptions.cancelToken
      });
    };
    // 清理mask
    const clearMask = function () {
      if (maskElement) {
        if (mask === true) {
          maskElement.style.display = 'none'
        } else {
          if (maskElement.parentNode) { // Fuck flow
            maskElement.parentNode.removeChild(maskElement)
          }
          // 恢复static定位
          if (isRefStatic && refElement) {
            refElement.style.position = 'static'
          }
        }
      }
    };
    axios(ajaxOptions).then((response) => {
      const data = response.data
      if (ajaxOptions.responseType === 'json') {
        const header = data.header
        if (header.code !== 200) {
          if (!silentError) { // 业务错误自动提示
            alert({
              content: header.message,
              iconType: 'fail'
            })
          }
        }
      }
      clearAjaxSource()
      clearMask()
    }).catch((err) => {
      if (err.response) {
        const response = err.response;
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        alert({
          content: response.data + response.status + response.headers,
          iconType: 'fail'
        })
      } else if (err.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(err.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', err.message)
      }
      clearAjaxSource();
      clearMask();
    });
  }
})();
export {
  c2s
};
