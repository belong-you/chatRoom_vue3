<template>
<div class="wrap clearfix">
	<div class="head">
		<h1>在线聊天室</h1>
		<ul class="link">
			<li><a href="https://github.com/belong-you" target="_blank">github</a></li>
			<li><a href="http://bozai.tech" target="_blank">blog</a></li>
		</ul>
		<AllUsers :user="user" />
	</div>

	<!-- 侧边栏 -->
	<ul class="sidebar clearfix">
		<li v-for="item in rooms" :key="item.id" :class="item.id == roomId ? 'active' : ''">
			<p @click="setRouter(item.id)">{{ item.name }}</p>
		</li>
		<li style="text-align: center; color: #999" 
			@click="eject = true"
		>+</li>
	</ul>
	
	<!-- 聊天区域 -->
	<div class="discuss" v-for="room in rooms" :key="room.id">
		<ChatLogs2 :roomId="room.id" :user="user" />
	</div>

	<EjectFrame w='400px' h='140px' v-if="eject">
		<AddRoom :user="user" />
	</EjectFrame>
</div>
</template>

<script>
import ChatLogs2 from '../components/ChatLogs2.vue';
import SendMessage from '../components/SendMessage.vue';
import AllUsers from '../components/AllUsers.vue';
import EjectFrame from '../components/ejectFrame.vue';
import AddRoom from '../components/AddRoom.vue';

import getChatData from '../components/getChatData';
import { checkUser } from '../axios';
import { useRouter } from 'vue-router';

export default {
	components: {
		ChatLogs2,
		SendMessage,
		AllUsers,
		EjectFrame,
		AddRoom,
	},
	setup () {
		return {
			...getChatData()
		};
	},
	beforeRouteEnter (to, from, next) {
		checkUser().then(res => {
			if (res.code === 200) {
				to.meta.user = res.data;
				next();
			} else {
				location.pathname = '/signIn';
			}
		})
	},
	provide () {
		return {
			getChatLogs: this.getChatLogs,

		}
	}
};
</script>

<style lang="scss" scoped>
.wrap{
	width: 100%;
	max-width: 998px;
	margin: 50px auto;
	padding: 12px;
	border-radius: 10px;
	box-shadow: 0 5px 10px rgba(0,0,0,.2);
	box-sizing: border-box;
	position: relative;
	a{
		display: inline-block;
		width: 100%;
	}
}

.head{
	text-align: center;
	position: relative;
	padding-bottom: 10px;
	border-bottom: 1px solid #ccc;
	.link{
		position: absolute;
		top: 20px;
		right: 0;
		font-size: 12px;
		li{
			float: left;
			margin-left: 10px;
		}
	}
}

.sidebar{
	li{
		padding: 2px 4px;
		cursor: pointer;
		&:hover{
			background: rgba(255, 166, 0, 0.4);
		}
		&.active{
			background: orange;
			color: white;
		}
	}
}
.discuss{
	background: #FAFAFA;
}

@media (max-width: 750px) {
	.wrap{
		margin: 0;
		height: 100vh;
	}
	.sidebar{
		margin: 5px 0;
		li{
			float: left;
			margin-right: 20px;
		}
	}
}

@media (min-width: 750px) {
	$sidebarW: 20%;
	.sidebar{
		width: $sidebarW;
		li{
			line-height: 40px;
			padding-left: 10px;
			&:not(:nth-last-child(1)){
				border-bottom: 1px solid #eee;
			}
		}
	}
	.discuss{
		width: 100% - $sidebarW;
	}
	.sidebar, .discuss{
		float: left;
	}
	.add-chat{
		position: absolute;
		bottom: 40px; left: 6%;
		background: #296af8;
		color: white;
		padding: 5px 10px;
		border-radius: 5px;
		cursor: pointer;
	}
}
</style>
