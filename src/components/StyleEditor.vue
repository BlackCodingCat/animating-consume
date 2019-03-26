<template>
  <div class="styleEditor" ref="container">
      <div class="code" v-html="codeInStyleTag"></div>
      <pre>
          <div class="" v-html="highlightedCode"></div>
      </pre>
  </div>
</template>

<script>
import Prism from "prismjs";
export default {
  name: "StyleEditor",
  props: ["code"],
  computed: {
    //代码高亮
    highlightedCode: function() {
      return Prism.highlight(this.code, Prism.languages.css);
    },
    //用<style>标签包裹的代码
    codeInStyleTag: function() {
      return `<style>${this.code}</style>`;
    }
  },
  methods: {
      goBottom() {
        this.$refs.container.scrollTop = 100000
      }
  },
};
</script>

<style scoped>
</style>