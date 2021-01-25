import axios from './intercept';

// 注册账号
export const createUser = (name, pwd, headImg, time) => axios.post('users', {
    name,
    pwd,
    headImg,
    time,
})

// 登录
export const singInUser = (name, pwd) => axios.get('users', {
    params: {
        name,
        pwd,
    }
})

// 发送请求让服务端看 cookie 是否正确
export const checkUser = () => axios.put('users');

// 创建一条聊天消息
export const createDiscuss = (name, text, time, roomId) => axios.post('discuss', {
    name,
    text,
    time,
    roomId,
});

// 获取房间
export const getRooms = (name) => axios.get(`room`);