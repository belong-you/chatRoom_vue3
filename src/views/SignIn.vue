<template>
    <div class="signin">
        <div class="box">
            <p>
                <span>登录：</span>
                <input type="text" placeholder="请输入用户名" v-model="name">
            </p>
            <p>
                <span>密码：</span>
                <input type="password" @keydown="enter($event)" placeholder="请输入密码" v-model="pwd">
            </p>
            <p v-if="flag">
                <span>性别：</span>
                男：<input name="sex" type="radio" @click="sex = true" :checked="sex ? 'checked': ''">&nbsp;&nbsp;
                女：<input name="sex" type="radio" @click="sex = false">
            </p>
            <div class="btn">
                <button @click="signUp">临时访客登录</button>
                <button @click="flag = !flag">{{ flag ? '登录' : '注册'}} &gt;</button>
                <button class="sign-in" @click="send">确认{{ flag ? '注册' : '登录' }}</button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getCurrentDate } from '../util/date';
import { createUser, singInUser } from '../axios/index';
import message from '../components/message';
const randomNum = (max, min) => Math.floor(Math.random() * (max - min) + min);
export default {
    setup () {
        const router = useRouter();

        let flag = ref(false);
        let name = ref('');
        let pwd = ref('');
        let sex = ref(true);

        async function send () {
            if (!name.value || !pwd.value) {
                message('请输入用户名、密码');
                return;
            }

            if (flag.value) {
                // 注册
                const headImg = sex.value ? 'http://bozai.tech/images/1610785454265_8dwkbt.png' : 'http://bozai.tech/images/1610785454264_81j2mw.png';
                const { year, month, day, hour, minute, second} = getCurrentDate();
                const time = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
                await createUser(name.value, pwd.value, headImg, time).then(res => {
                    if (res.code === 200) {
                        router.push('/chat/1');
                        message('注册成功，已为您自动登录');
                    } else {
                        message(res.msg);
                    }
                })
            } else {
                // 登录
                await singInUser(name.value, pwd.value).then(res => {
                    if (res.code === 200) {
                        message(res.data);
                        router.push('/chat/1');
                    } else {
                        message(res.msg);
                    }
                })
            }
            // document.cookie = `user=${name.value}; path=/`
        }

        function enter (e) {
            if (e.keyCode === 13) {
                send();
            }
        }

        async function signUp () {
            const name = `id_${Date.now()}`;
            const headImg = randomNum(0, 2) ? 'http://bozai.tech/images/1610785454265_8dwkbt.png' : 'http://bozai.tech/images/1610785454264_81j2mw.png';
            const { year, month, day, hour, minute, second } = getCurrentDate();
            const time = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
            await createUser(name, name, headImg, time).then(res => {
                if (res.code === 200) {
                    router.push('/chat/1');
                    message('注册成功，已为您自动登录');
                } else {
                    message(res.msg);
                }
            })
        }
        return {
            flag,
            send,
            enter,
            name,
            pwd,
            sex,
            signUp,
        }
    }
}
</script>

<style lang='scss' scoped>
.signin{
    width: 100vw;
    height: 100vh;
    position: relative;
    .box{
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        width: 320px;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 5px 10px rgba(0,0,0,.2);
        p{
            margin-bottom: 16px;
            span{
                display: inline-block;
                width: 20%;
            }
            input{
                width: 80%;
                border: 1px solid #999;
                box-sizing: border-box;
                line-height: 30px;
                border-radius: 5px;
                padding: 0 10px;
            }
            input[type="radio" i] {
                margin: 0;
                width: 20px;
            }
        }
        .btn{
            text-align: center;
        }
        button{
            color: #2b80ff;
            cursor: pointer;
            border-radius: 4px;
            padding: 4px 10px;
            &.sign-in{
                background: #266bff;
                color: white;
                margin-left: 5px;
            }
        }
    }
}
</style>