<template>
    <ul class="all-users">
        <li>
            {{ user }}
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        user: {}
    },
    created () {
        // console.log(this.users)
    }
}
</script>

<style lang='scss' scoped>
.all-users{
    position: absolute;
    top: 30%;
    li{
        float: left;
        margin-right: 5px;
    }
}
</style>