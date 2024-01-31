<script>
export default {
    name: 'AppAlert',
    props: { isOpen: Boolean, type: String, dismissable: Boolean },
    emits: ['close']
}
</script>

<template>
    <div v-if="isOpen" :class="[`alert-${type || 'info'}`, { 'alert-dismissable': dismissable }]"
        class="alert fade show my-3" role="alert">
        <slot></slot>
        <button v-if="dismissable" type="button" class="btn-close" @click="$emit('close')"></button>
    </div>
</template>

<style></style>