## 基本约定
* 文件或者文件夹命名为多单词小写，中划线连接；
* *.vue* 文件可拆分为 *.vue*（结构)；*.css*（样式）；*.js*（逻辑）三种类型文件，其中 *.css*/*.js* 在.vue文件中被引用；
* *pages* 和 *modules* 中直接描述主功能的 *.vue* 文件命名为 *index.vue* ，样式文件命名为 *style.css* ，逻辑文件命名为 *script.js*（如果 *.vue* 格式文件不存在，可直接命名为 *index.js*，模板文件命名为 *template.js*）；
* *pages* 和 *modules* 中的文件目录支持层层嵌套；
* 组件命名风格遵循 *vue* 约定。
## 逻辑约定
* 路由和共享状态信息分散管理，分别维护在 *sitmap.js* 和 *store.js* 中，*sitmap.js* 只可能存在于 *pages* 目录下；*store.js* 可能存在于 *modules* 或 *pages* 目录下。