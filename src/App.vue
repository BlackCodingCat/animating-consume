<template>
  <div id="app">
    <StyleEditor ref="styleEditor" :code="currentStyle"></StyleEditor>
    <ResumeEditor ref="resumeEditor" :markdown="currentMarkdown" :enableHtml="enableHtml"></ResumeEditor>
  </div>
</template>

<script>
import "./assets/reset.css";
import StyleEditor from "./components/StyleEditor";
import ResumeEditor from "./components/ResumeEditor";

export default {
  name: "App",
  components: {
    StyleEditor,
    ResumeEditor
  },
  data() {
    return {
      interval: 40,
      currentStyle: "", //目前加载的style代码
      currentMarkdown: "", //目前加载的简历代码
      enableHtml: false, //选择是markdown格式还是html格式
      fullStyle: [
`/*
* Inspired by http://strml.net/
* 大家好，我是沈佳棋
* 俗话说，金三银四，时下已是三月底
* 大家是否已经找到心仪的工作or实习呢
* 今天我也要来打造一份特别的简历
* OK,废话不多说,Let's Go!
*/

/* 首先给所有元素加上过渡效果 */
* {
  transition: all .3s;
}
/* 白色背景太单调了，我们来点背景 */
html {
  color: rgb(222,222,222); background: rgb(0,43,54);
}
/* 文字离边框太近了 */
.styleEditor {
  padding: .5em;
  border: 1px solid;
  margin: .5em;
  overflow: auto;
  width: 45vw; height: 90vh;
}
/* 代码高亮 */
.token.selector{ color: rgb(133,153,0); }
.token.property{ color: rgb(187,137,0); }
.token.punctuation{ color: yellow; }
.token.function{ color: rgb(42,161,152); }

/* 加点 3D 效果呗 */
html{
  perspective: 1000px;
}
.styleEditor {
  position: fixed; left: 0; top: 0;
  -webkit-transition: none;
  transition: none;
  -webkit-transform: rotateY(10deg) translateZ(-100px) ;
          transform: rotateY(10deg) translateZ(-100px) ;
}

/* 接下来我给自己准备一个编辑器 */
.resumeEditor{
  position: fixed; right: 0; top: 0;
  padding: .5em;  margin: .5em;
  width: 48vw; height: 90vh;
  border: 1px solid;
  background: white; color: #222;
  overflow: auto;
}
/* 好了，我开始写简历了 */
`,
        `
/* 这个简历好像差点什么
 * 对了，这是 Markdown 格式的，我需要变成对 HR 更友好的格式
 * 简单，用开源工具翻译成 HTML 就行了
 */
`,
        `
/* 再对 HTML 加点样式 */
.resumeEditor{
  padding: 2em;
}
.resumeEditor h2{
  display: inline-block;
  border-bottom: 1px solid;
  margin: 1em 0 .5em;
}
.resumeEditor ul,.resumeEditor ol{
  list-style: none;
}
.resumeEditor ul> li::before{
  content: '•';
  margin-right: .5em;
}
.resumeEditor ol {
  counter-reset: section;
}
.resumeEditor ol li::before {
  counter-increment: section;
  content: counters(section, ".") " ";
  margin-right: .5em;
}
.resumeEditor blockquote {
  margin: 1em;
  padding: .5em;
  background: #ddd;
}
`
      ],
      fullMarkdown: 
`
沈佳棋
----

基本信息
----
性别: 男    年龄: 21    年级: 大三
联系电话: 15251852316   邮箱地址: sjq15251852316@163.com
籍贯: 江苏省南通市      当前所在地: 南京

求职意向
----
期望地点:江苏，浙江，上海   期望职位:web前端开发暑期实习 

教育经历
----
2016.09 - 2020.06  本科  南京邮电大学  自动化  专业排名5%~20% 

专业技能
----

* 熟练使用HTML,CSS构建静态界面，熟悉HTML语义化,CSS选择器,文档流，盒模型
* 熟悉W3C标准、ECMA规范、TypeScript, 熟练使用Less/Stylus预编译器
* 熟悉jQuery的常用API，如jQuery常用的DOM操作，jQuery事件,Ajax等。
* 熟练使用bootstrap、Swiper、Animate、WOW、Echarts等小型框架。
* 熟悉使用MySQL数据库。
* 熟练使用git代码管理工具，熟悉webpack构建工具以及npm的使用。 
* 了解Vuejs前端框架。 
* 了解后端开发，接触过Java及Nodejs

校内经历
----
南京邮电大学自动化学院科学技术与发展协会 硬件部部长

项目经历
----
1. 苏州市白洋湾水厂经营分析与成本管理系统
2. 黑猫学院响应式首页
3. 京东移动端界面
4. 拼多多移动端高仿版

获奖情况
----

1. 南京邮电大学创新杯校赛二等奖
2. 南京邮电大学第十届物理及实验作品竞赛三等奖
3. 南京邮电大学第一届工程训练综合能力竞赛校赛二等奖
4. 南京邮电大学自动化学院第八届海善达杯二等奖
5. "京泽杯"LED灯饰设计大赛三等奖
`
    };
  },
  mounted() {
    this.makeResume();
  },
  methods: {
    makeResume: async function() {
       await this.progressivelyShowStyle(0);
       await this.progressivelyShowResume();
       await this.progressivelyShowStyle(1);
       await this.showHtml();
       await this.progressivelyShowStyle(2);
    },
    showHtml: function(){
        return new Promise((resolve,reject)=>{
            this.enableHtml = true;
            resolve();
        })
    },
    progressivelyShowStyle(n) {
      return new Promise((resolve, reject) => {
          let interval = this.interval
          //定义showStyle方法
          let showStyle = (async function () {
            let style = this.fullStyle[n] //字符模板
            if (!style) { return }
            // 计算前 n 个 style 的字符总数
            let length = this.fullStyle.filter((_, index) => index <= n).map((item) => item.length).reduce((p, c) => p + c, 0)
            let prefixLength = length - style.length
            if (this.currentStyle.length < length) {
              let l = this.currentStyle.length - prefixLength
              let char = style.substring(l, l + 1) || ' '
              this.currentStyle += char
              if (style.substring(l - 1, l) === '\n' && this.$refs.styleEditor) {
                this.$nextTick(() => {
                  this.$refs.styleEditor.goBottom() 
                })
              }
              setTimeout(showStyle, interval)
            } else {
              resolve()
            }
          }).bind(this)
            
          showStyle()
        })
    },
    progressivelyShowResume() {
        return new Promise((resolve, reject) => {
          let length = this.fullMarkdown.length
          let showResume = () => {
            if (this.currentMarkdown.length < length) {
              this.currentMarkdown = this.fullMarkdown.substring(0, this.currentMarkdown.length + 1)
              let lastChar = this.currentMarkdown[this.currentMarkdown.length - 1]
              let prevChar = this.currentMarkdown[this.currentMarkdown.length - 2]
              if (prevChar === '\n' && this.$refs.resumeEditor) {
                this.$nextTick(() => this.$refs.resumeEditor.goBottom())
              }
              setTimeout(showResume, this.interval)
            } else {
              resolve()
            }
          }
          showResume()
        })
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
* {
  box-sizing: border-box;
}
html {
  /* 100%视口高度 */
  min-height: 100vh;
}
</style>