<script>
import AppFooter from './components/AppFooter.vue';
export default {
  components: { AppFooter }
}
</script>

<template>
  <AppHeader />
  <main>
    <RouterView />
  </main>
  <AppFooter />
</template>
<style lang="scss">
@use './assets/scss/reset' as *;

body {
  font-family: sans-serif;
}
</style>
