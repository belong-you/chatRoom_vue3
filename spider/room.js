const mysql = require('mysql2/promise');
const config = require('./power');

/**
 * 新建一个聊天房间
 * @param {*} name 房间昵称
 * @param {*} amdin 管理员账号
 * @param {*} online 在线人数
 * @param {*} max 最大支持人数
 * @param {*} time 房间创建时间
 * @param {*} pwd 房间的密码（可选）
 * @param {*} isdel 房间是否已删除
 */
module.exports.createRoom = async (id, name, time, admin) => {
    const connection = await mysql.createConnection(config);
    
    const sql = "INSERT INTO room (id, name, time, admin) VALUES(?, ?, ?, ?);";
    const [results] = await connection.execute(sql, [id, name, time, admin]);
    connection.end();
    return results;
}

/**
 * 查找房间
 * @param {*} admin 管理员账号
 */
module.exports.queryRoom = async (admin) => {
    const connection = await mysql.createConnection(config);
    
    const sql = `
    SELECT t1.* 
    FROM room AS t1 LEFT JOIN discuss AS t2 
    ON t2.name = ?
    WHERE t2.room_id = t1.id
    or t1.id = 1
    or t1.admin = ?
    group by t1.id;
    `;
    const [results] = await connection.execute(sql, [admin, admin]);
    connection.end();
    return results;
}

module.exports.queryIdRoom = async (id) => {
    const connection = await mysql.createConnection(config);
    
    const sql = "SELECT * FROM room WHERE id = ?;";
    const [results] = await connection.execute(sql, [id]);
    connection.end();
    return results;
}

/**
 * 删除一个房间
 * @param {*} id 房间 id
 * @param {*} isdel 设置为 1 删除，0 恢复房间
 */
module.exports.deleteRoom = (id, isdel = 1) => {
    
}