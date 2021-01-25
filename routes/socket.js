const socketIO = require('socket.io');

const { queryDiscuss, createDiscuss } = require('../spider/discuss');
const { queryRoom, createRoom, queryIdRoom } = require('../spider/room');
const { changeUserOnline } = require('../spider/users');
const { queryUser } = require('../spider/users');
const addZero = (v) => v < 10 ? '0' + v : v;

module.exports = async (server) => {
    
    const io = socketIO(server, {
        cors: true,
    });
    
    io.on('connection', async socket => {
        
        socket.on('name', async chunk => {
            socket.broadcast.emit('userin', `${chunk}进入聊天室`);
            await changeUserOnline(chunk, 1);  // 修改账号的在线状态

            const rooms = await queryRoom(chunk);  // 看当前账号有多少个房间
            console.log(rooms)
            socket.emit('rooms', rooms);
        })
        

        socket.on('init', async chunk => {
            const user = await queryUser(chunk.user);
            const time = switchTimeFormat(user[0].createtime);

            // 聊天记录
            socket.emit(`roomLogs`, await queryDiscuss(chunk.id, time));
        })

        // 添加聊天记录
        socket.on('addChat', async chunk => {
            const { name, text, time, roomId } = chunk;
            const user = await queryUser(name);
            const newTime = switchTimeFormat(user[0].createtime);

            await createDiscuss(name, text, time, roomId);  // 添加聊天内容
            socket.broadcast.emit(`chatLogs${roomId}`, await queryDiscuss(roomId, newTime));
        })

        // 创建房间
        socket.on('addRoom', async chunk => {
            const { id, name, time, admin } = chunk;
            const data = await queryIdRoom(id);
            if (data.length !== 0) {
                // 房间已存在
                socket.emit('addRoomMsg', '抱歉，房间 ID 已存在，请重新发送请求');
                return;
            }
            await createRoom(id, name, time, admin);
            socket.emit('addRoomMsg', '房间创建成功');
        })

        socket.on('jionRoom', async chunk => {
            const { name, time, roomId } = chunk;
            const data = await queryIdRoom(roomId);
            if (data.length === 0) {
                socket.emit('jionRoomMsg', '找不到该房间，亲');
                return;
            }
            await createDiscuss(name, text = 'hello everyone', time, roomId);
            socket.emit('jionRoomMsg', '已加入该房间');
        })

        // 用户掉线
        socket.on('outline', async chunk => {
            await changeUserOnline(chunk, 0);
            socket.broadcast.emit('new outline', `${chunk} 退出聊天室`);
        })


        // 客户端断开连接
        socket.on('disconnect', () => {
            socket.broadcast.emit("userout", '退出聊天室');
            // console.log('客户端断开')
        })

    })
    
}

/**
 * 格林时间转为北京时间
 * @param {*} time 
 */
function switchTimeFormat (time) {
    const dateTime = new Date(time);
    const year = dateTime.getFullYear();
    const month = dateTime.getMonth() + 1;
    const date = dateTime.getDate();
    const hour = dateTime.getHours();
    const minute = dateTime.getMinutes();
    const second = dateTime.getSeconds();
    return `${year}-${addZero(month)}-${addZero(date)} ${addZero(hour)}:${addZero(minute)}:${addZero(second)}`;
}