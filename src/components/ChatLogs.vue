<template>
    <div class="chat-logs">
        <ul>
            <li v-for="log in data" 
                :key="log.id" class="clearfix" 
                :class="log.name === user ? 'user' : ''"
            >
                <span class="head">
                    <img :src="log.head_img" alt="">
                </span>
                <div class="content">
                    <p>
                        <strong :style="{display: log.name === user ? 'none' : 'inline-block'}">{{ log.name }}</strong>
                        <span class="time">{{ switchTimeFormat(log.time) }}</span>
                    </p>
                    <div class="text">{{ log.text }}</div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import { switchTimeFormat } from '../util/date';

export default {
    props: {
        data: {},
        logsScrollTo: {},
        user: {},
    },
    methods: {
        switchTimeFormat,
    },
    updated() {
        this.$props.logsScrollTo();
        // console.log(this.$props.data)
    }
}
</script>

<style lang='scss' scoped>
.chat-logs{
    li{
        margin-bottom: 20px;
        &.user{
            span, div{
                float: right;
            }
        }
        .head{
            float: left;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            position: relative;
            img{
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 100%;
            }
        }
        .content{
            float: left;
            margin: 0 10px;
            .time{
                font-size: 10px;
                color: #666;
                margin-left: 10px;
            }
            .text{
                display: inline-block;
                background: white;
                padding: 5px 12px;
                border-radius: 5px;
                margin-top: 5px;
                max-width: 400px;
                word-break: break-all;
                // white-space: pre;
            }
        }
    }
}
@media (max-width: 750px) {
    .chat-logs li .content .text{
        max-width: 60vw;
    }

}
</style>