## 项目名称：云端聊天系统

该项目主要作为练习 socket 为主，故一些细节上并未做处理。[在线预览](http://chat.bozai.tech)

## 技术栈

博客站点：Vue3、socket.io、vue-router、Axios、Scss

后台接口：NodeJS、koa、Mysql

## 项目运行

```js
git clone https://github.com/belong-you/chatRoom_vue3

// 切换分支
git checkout master  // 聊天系统站点
git checkout server  // 后台接口
git checkout db  // 数据库结构

npm install
// 接下来可按 package.json 配置脚本运行
```

## 线上部署

nginx 代理、pm2

```nginx
server {
    listen       80;
    server_name  chat.bozai.tech;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_http_version 1.1; 
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_connect_timeout 60;
        proxy_read_timeout 600;
        proxy_send_timeout 600;
    }
}
```

## 数据库结构设计

`users` 账号管理

|   id*   | name* | pwd* | head_img* | createtime*  |
| :-----: | :---: | :--: | :-------: | :----------: |
| 账号 ID | 昵称  | 密码 | 头像地址  | 账号创建时间 |

`room`  聊天房间

|   id*   |  name*   |  time*   | admin*（外键 `user.name`） |
| :-----: | :------: | :------: | :------------------------: |
| 房间 ID | 房间名称 | 创建时间 |  管理员（房间是谁创建的）  |

`discuss` 聊天记录

|   id*   | name*（外键`user.name`） |   text   |  time*   |   isdel*   | room_id*（外键`room.id`） |
| :-----: | :----------------------: | :------: | :------: | :--------: | :-----------------------: |
| 记录 ID |          用户名          | 聊天内容 | 创建时间 | 是否被删除 |        指向房间 ID        |

获取用户拥有的房间：

```mysql
SELECT t1.*  -- 只要 room 表中的数据
FROM room AS t1 LEFT JOIN discuss AS t2 
ON t2.name = ?  -- 查看 discuss 表中关于该用户的数据
WHERE t2.room_id = t1.id
or t1.id = 1  -- room 表中 ID 为 1 是所有人都在的房间，所以无论是哪个用户，我们都要把这个房间给他
or t1.admin = ?  -- 管理员是该用户的数据
group by t1.id;  -- 去下重
```

获取某个房间的聊天记录：

```mysql
SELECT t1.*, t2.head_img, t2.createtime
FROM discuss AS t1 LEFT JOIN users AS t2  -- 查询 discuss 和 users 两张表中的数据
ON t1.name = t2.name 
WHERE room_id = ?  -- 要查询的房间 ID
AND time > ?  -- 聊天记录的时间必须大于用户创建账号的时间（也就是说不能把在用户注册之前的聊天记录也给他）
ORDER BY time ASC;
```

> 当然，真正项目中不能这么设计，数据量大了之后查询效率就会慢很多了 ^_^

## 技术攻克

1. 数据刷新闪烁问题

    刚开始我是用同一个子组件来响应多个房间的数据的，在点击 a 房间时，加载 a 房间的数据；点击 b 房间时，加载 b 房间的数据。

    来回这样切换，页面数据出现了问题。每次切换，数都会显示一下之前房间的再展现出当前房间的数据。

    **造成闪烁的原因我想了想可能与以下几点有关：**

    - socket 本身是与的服务器持续连接的，一直会保持连接状态，每当切换房间时，都会初始化一遍数据；
    - 自身代码问题（仔细纠结之后把锅甩给了 socket， ^_^），因为之前做过类似的 http 请求，并不会出现该问题。

    **解决方式：**

    - 使用路由，通过路由地址来分别发送请求

        ```js
        beforeRouteEnter (to, from, next) {
            // 发出请求，验证用户是谁，存在 meta 参数上（user.name 存在 cookie 上）
            next();
        },
        setup () {
        // 根据路由 params.id，meta.user 请求数据
        }
        ```
        
        > 当然，路由发生改变时要处理一些内容
        
    - 后端发送数据，给事件传一个 ID 来确定应该将数据响应给哪个房间

        ```js
        socket.on('addChat', async chunk => {
            const { roomId } = chunk;
            socket.broadcast.emit(`chatLogs${roomId}`, await queryDiscuss(roomId));
        })
        ```

2. 减少数据请求，优化页面

    假设用户创建了 n 个房间，服务器就要响应 n 个房间的聊天信息吗？显然是不对的。
    
    同样解决方式依然是用到了路由守卫：
    
    ```js
    onBeforeRouteUpdate((to, from, next) => {
    	// 请求拦截
        if (params.id !== props.id) return;
        
        // 一致则发送请求
        // ....
    })
    ```

3. 一个关于实现人工智能对话（机器人聊天）的想法 [@/computerTalk](https://github.com/belong-you/computerTalk)

### 说明

> 以上代码并不全，只是提供一个思路，具体代码可翻阅源码查看

### 联系我

微信：15581766609（手机同号）

邮箱：1781926993@qq.com