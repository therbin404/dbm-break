<script setup>
import { useSessionStore } from '../stores/session'
import { mapStores } from 'pinia'
</script>
<script>
export default {
    computed: {
        ...mapStores(useSessionStore),
    }
}
</script>

<template>
    <div class="about">
        <h1>Helloas, {{ useSessionStore.nickname }}</h1>
    </div>
</template>
