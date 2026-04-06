<script setup>
import { ref } from 'vue'
import { useSessionStore } from '@/stores/session'

const session = useSessionStore()

function listServers() {
    session.listServers()
}

</script>

<template>
    <div class="about">
        <h1>Sessions page</h1>
        <button @click="listServers">listServers</button>
    </div>
</template>
