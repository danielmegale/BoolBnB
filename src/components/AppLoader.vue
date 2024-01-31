<script>
export default {

};
</script>
<template>
    <div class="app-loader">
        <div class="loader-content">
            <i class="fa-solid fa-house-signal fa-bounce fa-2xl" style="color: #25dd85;"></i>
        </div>
    </div>
</template>


<style scoped lang="scss">
.app-loader {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgb(120, 119, 119);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3;

    .loader-content {
        text-align: center;
        color: white;
        font-size: 2rem;
    }
}
</style>