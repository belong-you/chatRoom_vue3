const mysql = require('mysql2/promise');
const config = require('./power');

/**
 * 查询相关房间消息记录
 * @param {*} id
 */
module.exports.queryDiscuss = async (id, time) => {
    const connection = await mysql.createConnection(config);
    
    const sql = `
    SELECT t1.*, t2.head_img, t2.createtime
    FROM discuss AS t1 LEFT JOIN users AS t2 
    ON t1.name = t2.name 
    WHERE room_id = ?
    AND time > ?
    ORDER BY time ASC;`;
    const [results] = await connection.execute(sql, [id, time]);
    connection.end();
    return results;
}

/**
 * 发送一条评论消息 | 进入房间
 * @param {*} name 发送消息的账号
 * @param {*} text 内容（进入房间传 null）
 * @param {*} time 创建时间
 * @param {*} roomId 对应的房间号
 * @param {*} isregret 消息是否被撤回
 * @param {*} isdel 消息是否已被删除
 */
module.exports.createDiscuss = async (name, text, time, roomId, isregret = 0, isdel = 0) => {
    const connection = await mysql.createConnection(config);
    
    const sql = "INSERT INTO discuss(name, text, time, room_id, isregret, isdel) VALUES(?, ?, ?, ?, ?, ?);";
    const [results] = await connection.execute(sql, [name, text, time, roomId, isregret, isdel]);
    connection.end();
    return results;
}

/**
 * 撤回消息
 * @param {*} id 
 */
module.exports.regretDiscuss = (id) => {}

/**
 * 删除消息
 * @param {*} id 
 */
module.exports.deleteDiscuss = (id) => {}