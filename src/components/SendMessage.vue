<template>
    <div class="send">
        <!-- <div class="util">
            <button>@</button>
            <button>+</button>
        </div> -->
        <textarea placeholder="请输入文字" v-model="text" @keydown="enter($event)"/>
        <button class="enter" @click="send">发 送</button>
    </div>
</template>

<script>
import { ref, onUpdated, getCurrentInstance, inject } from 'vue'
import { createDiscuss } from '../axios';
import { getCurrentDate } from '../util/date';
import { opinion } from '../util/bro';
import { ws } from '../axios/url';
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import message from '../components/message';
export default {
    setup () {
        const route = useRoute();
        const current = getCurrentInstance();
        const setChatLogs = inject('setChatLogs');
        const { roomId, curUser } = current.props;
        let text = ref('');
        let id = ref(roomId);
        

        // 发送消息
        function send () {
            if (text.value === '') {
                message('输入内容不能为空');
                return
            };

            const socket = io.connect(ws);
            const { year, month, day, hour, minute, second} = getCurrentDate();

            socket.emit('addChat', {
                name: curUser,
                text: text.value,
                time: `${year}-${month}-${day} ${hour}:${minute}:${second}`,
                roomId: id.value,
            })
            text.value = '';
        }
        
        onBeforeRouteUpdate((to, from, next) => {
            id.value = to.params.id;
            next();
        })
        
        onUpdated(() => {
            // console.log(123456)
            const { roomId, curUser } = current.props;

            const socket = io.connect(ws);
            socket.on(`chatLogs${roomId}`, data => {
                setChatLogs(data)
            })
        })

        // 回车键
        function enter (e) {
            if (opinion()) {
                return;
            } else {
                if (e.keyCode == 13) {
                    e.preventDefault();
                    send();
                }
            }
        }


        return {
            text,
            send,
            enter,
        }
    },
    props: {
        roomId: {},
        curUser: {},
        logsScrollTo: {}
    }
}
</script>

<style lang='scss' scoped>
.send{
    background: white;
    textarea{
        width: 100%;
        height: 50px;
        background: white;
        margin-top: 4px;
        border: 1px solid #999;
        padding: 5px 10px;
        box-sizing: border-box;
        font-size: 16px;
        .util button{
            color: #666;
        }
    }
    .enter{
        color: white;
        padding: 5px 10px;
        background: #296af8;
        border-radius: 4px;
    }

}
@media (min-width: 750px) {
    .send{
		padding: 10px;
		box-sizing: border-box;
		position: relative;
        textarea{
            margin-bottom: 30px;
        }
        .enter{
            position: absolute;
            bottom: 5px; right: 10px;
        }
	}
}
@media (max-width: 750px) {
    .send{
		position: fixed;
		bottom: 0; left: 0;
		width: 100%;
        padding-bottom: 30px;
        textarea{
            margin-left: 10px;
            width: 78%;
            height: 40px;
            vertical-align: middle;
        }
        .enter{
            vertical-align: middle;
            margin-left: 10px;
        }
	}
}
</style>