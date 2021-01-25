import { createRouter, createWebHistory } from "vue-router";
import ChatWrap from '../views/ChatWrap.vue';
import SignIn from '../views/SignIn.vue';
// https://next.router.vuejs.org/guide/migration/


export default createRouter({
    history: createWebHistory(), // mode:"history"
    routes: [
        {
            path: '/',
            redirect: '/chat/1'
        },
        {
            path: '/chat/:id',
            component: ChatWrap,
            meta: {
                user: null,
            },
        },
        {
            path: '/signIn',
            component: SignIn,
        }
    ]
});