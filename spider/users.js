const mysql = require('mysql2/promise');
const config = require('./power');

/**
 * 创建一个用户
 * @param {*} name 用户名 
 * @param {*} pwd 密码
 * @param {*} headImg 头像地址
 * @param {*} online 已读公告条数
 */
module.exports.createUser = async (name, headImg, pwd = null, time, online = 0) => {
    const connection = await mysql.createConnection(config);
    
    const sql = "INSERT INTO users(name, pwd, head_img, createtime, online) VALUES(?, ?, ?, ?, ?);";
    const [results] = await connection.execute(sql, [name, pwd, headImg, time, online]);
    connection.end();
    return results;
}

/**
 * 查询账户名是否存在
 * @param {*} name 
 */
module.exports.queryUser = async (name) => {
    const connection = await mysql.createConnection(config);
    
    const sql = "SELECT * FROM users WHERE name = ? OR id = ?;";
    const [results] = await connection.execute(sql, [name, name]);
    connection.end();
    return results;
}


/**
 * 修改账号在线情况
 * @param {*} name 账号名称
 */
module.exports.changeUserOnline = async (name, flag) => {
    const connection = await mysql.createConnection(config);
    
    const sql = "UPDATE users SET online = ? WHERE name = ?;";
    const [results] = await connection.execute(sql, [flag, name]);
    connection.end();
    return results;
}