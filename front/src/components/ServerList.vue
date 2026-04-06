<script setup>

import { useSessionStore } from '@/stores/session'
import { onMounted } from 'vue'

const session = useSessionStore()


onMounted(async () => {
    await session.listServers()
})
</script>

<template>
    <div>
        <h2>Mes serveurs</h2>
        <ul>
            <li v-for="server in session.servers" :key="server.id">
                {{ server.name }}
            </li>
        </ul>
    </div>
</template>