<template>
    <div class="logs-wrap" v-show='roomId == route_id'>
        <div class="chat-logs" ref='logs'>
            <ul>
                <li v-for="log in chatLogs" 
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
        <SendMessage :roomId="roomId" :curUser="user" />
    </div>
</template>

<script>
import SendMessage from '../components/SendMessage.vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { switchTimeFormat } from '../util/date';
import { ref, getCurrentInstance, provide, onUpdated } from 'vue';
import { ws } from '../axios/url';
export default {
    setup () {
        const route = useRoute();
        const current = getCurrentInstance();
        const { roomId, user } = current.props;
        const socket = io.connect(ws);

        let route_id = ref(route.params.id);  // route id
        let chatLogs = ref([]);  // 当前房间的聊天记录
        
        socket.emit('init', {id: roomId, user: user});
        socket.on('roomLogs', async res => {
            chatLogs.value = await res;
        })

        // 切换路由，是否该组件
        onBeforeRouteUpdate((to, from, next) => {
            route_id.value = to.params.id;
            next();
        })

        // 数据有变化，滚动条滚动到最底部
        onUpdated(() => {
            const logs = current.refs.logs;
            logs.scrollTo(0, logs.scrollHeight)
        });

        // 给子组件提供一个函数，来改变 chatLogs 数据
        provide('setChatLogs',  data => chatLogs.value = data);

        return {
            route_id,
            user,
            roomId,
            chatLogs,
        }
    },
    props: {
        user: {},
        roomId: {},
        logsScrollTo: {}
    },
    methods: {
        switchTimeFormat,
    },
    components: {
        SendMessage,
    },
}
</script>

<style lang='scss' scoped>
.chat-logs{
    padding: 10px;
    overflow-y: auto;
    &::-webkit-scrollbar{
		width: 4px;
	}
	&::-webkit-scrollbar-thumb{
		background: rgba(0,0,0,.2);
	}
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
    .chat-logs{
        height: 76vh;
        li .content .text{
            max-width: 60vw;
        }
    }
}
@media (min-width: 750px) {
    .chat-logs{
        height: 50vh;
        border-left: 1px solid #999;
    }
}
</style>