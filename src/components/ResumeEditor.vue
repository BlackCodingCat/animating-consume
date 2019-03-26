<template>
    <div class="resumeEditor" :class="{htmlMode:enableHtml}" ref="container">
        <pre v-if="enableHtml">
            <div v-html="result"></div>
        </pre>
        <pre v-else>
            {{result}}
        </pre>
    </div>
</template>

<script>
    import marked from 'marked';
    export default {
        name:'ResumeEditor',
        props:['markdown','enableHtml'],
        computed:{
            result:function(){
                return this.enableHtml ? marked(this.markdown) : this.markdown
            }
        },
        methods: {
            goBottom: function () {
                this.$refs.container.scrollTop = 100000
            },
            goTop: function(){
                this.$refs.container.scrollTop = 0
            }
        },
    }
</script>

<style scoped>
    @media (max-width:500px){
        .resumeEditor{
        }
    }
    .htmlMode{
        animation: flip 2s;
    }
    @keyframes flip {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>