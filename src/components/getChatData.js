// import io from 'socket.io';
import { ref, onUpdated, provide, getCurrentInstance, onBeforeUpdate } from 'vue';
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";
import { ws } from '../axios/url';
import message from './message';

export default () => {
    const current = getCurrentInstance();
    const socket = io.connect(ws);
    const router = useRouter();
    const route = useRoute();
    const id = route.params.id;

    let rooms = ref([]);  // 账户拥有的房间
    let chatLogs = ref([]);  // 当前房间的聊天记录
    let roomId = ref(id);  // 当前房间 id
    
    let user = ref(null);  // 当前用户是 ？
    const arr = route.meta.user.split(',');
    user.value = String.fromCharCode(...arr);

    socket.emit('name', user.value);
    socket.on('rooms', async res => {
        rooms.value = await res;
    })

    // 进入聊天室
    socket.on('userin', res => message(res));
    // 退出聊天室
    socket.on("userout", res => {
        socket.emit('outline', user.value);
    });
    socket.on('new outline', res => message(res));
    
    // 切换路由
    function setRouter (num) {
        router.replace(`/chat/${num}`);
    }
    onBeforeRouteUpdate(async (to, from, next) => {
        const id = to.params.id;
        roomId.value = id;
        next();
    })

    // 弹框
    let eject = ref(false);  // 弹框是否显示
    provide('setEject', flag => eject.value = flag);
    
    return {
        rooms,
        chatLogs,
        roomId,
        user,
        id,
        eject,
        setRouter,
    }
}