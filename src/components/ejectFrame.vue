<template>
    <div class="eject-frame" @click.self="setEject(false)" >
        <div class="box" :style="{width: w, height: h}">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import { provide, ref, inject, getCurrentInstance } from 'vue';
export default {
    setup () {
        let setEject = inject('setEject');
        return {
            setEject,
        }
    },
    props: {
        w: {},
        h: {},
    }
}
</script>

<style lang="scss" scoped>
.eject-frame{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    .box{
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 12px;
        background: white;
        padding: 20px;
        box-shadow: 0 5px 10px rgba(0,0,0,.2);
    }
}
</style>