<template>
    <div class="add-room">
        <p>
            <span>创建房间：</span>
            <input type="text" v-model="createInp" 
                @focus="flag = true; jionInp = null" 
                placeholder="请输入房间名称"
            />
            <button :style="{background: !flag ? '#999' : '#296af8'}"
                @click="createRoom"
            >确认</button>
        </p>
        <p>
            <span>加入房间：</span>
            <input type="number" v-model="jionInp" 
                @focus="flag = false; createInp = null" 
                placeholder="请输入房间 ID"
            />
            <button :style="{background: flag ? '#999' : '#296af8'}"
                @click="jionRoom"
            >确认</button>
        </p>
    </div>
</template>

<script>
import { ref, getCurrentInstance } from 'vue';
import { getCurrentDate } from '../util/date';
import { ws } from '../axios/url';
import message from './message';
const randomNum = (max, min) => Math.floor(Math.random() * (max - min) + min);

export default {
    setup () {
        const socket = io.connect(ws);
        let flag = ref(true);  // true 时创建房间，false 加入房间
        let createInp = ref(null);
        let jionInp = ref(null);

        const current = getCurrentInstance();
        const { user } = current.props;
        function createRoom () {
            if (!flag.value) return;
            const { year, month, day, hour, minute, second} = getCurrentDate();
            socket.emit('addRoom', {
                id: randomNum(1000000, 100000),
                name: createInp.value,
                time: `${year}-${month}-${day} ${hour}:${minute}:${second}`,
                admin: user,
            })
            socket.on('addRoomMsg', res => {
                message(res);
            })
        }
        function jionRoom () {
            if (flag.value) return;
            const { year, month, day, hour, minute, second} = getCurrentDate();
            socket.emit('jionRoom', {
                name: user,
                time: `${year}-${month}-${day} ${hour}:${minute}:${second}`,
                roomId: Number(jionInp.value),
            })
            socket.on('jionRoomMsg', res => {
                message(res);
            })
        }
        return {
            flag,
            createInp,
            jionInp,
            createRoom,
            jionRoom,
        }
    },
    props: {
        show: {},
        user: {}
    }
}
</script>

<style lang="scss" scoped>
.add-room{
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    input{
        line-height: 30px;
        border: 1px solid #999;
        margin: 5px;
        padding: 0 5px;
        &[disabled]{
            border: 1px solid red;
        }
    }
    p{
        margin: 10px 0;
        text-align: center;
    }
    button{
        line-height: 32px;
        text-align: center;
        background: #296af8;
        color: white;
        padding: 0 20px;
    }
}
</style>