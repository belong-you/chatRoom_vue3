<template>
	<router-view></router-view>
</template>

<script>
import ChatWrap from './views/ChatWrap.vue';
export default {
	name: "App",
	components: {
		ChatWrap,
	}
};
</script>
