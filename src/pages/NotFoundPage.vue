
<script>
export default {

}
</script>
<template>
    <div class="error-404">
        <div class="error-content">
            <bold>Errore 4<i class="fa-solid fa-house-circle-exclamation fa-shake fa-2x" style="color: red"></i>4</bold>
            <p>Pagina non trovata</p>
        </div>
    </div>
</template>


<style scoped lang="scss">
body {
    position: relative;
}

.error-404 {
    position: absolute;
    background-size: cover;
    background-position: center;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    text-shadow: 0 3px black;
    font-size: 2em;
    background: rgba(77, 77, 77, 0.992);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;


    .error-content {
        text-align: center;
    }

}
</style>
