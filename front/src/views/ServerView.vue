<script setup>
import ServerList from '../components/ServerList.vue'
import { ref } from 'vue'
import { useSessionStore } from '@/stores/session'

const session = useSessionStore()
const serverInvitURL = ref('')

function addServer() {
    session.addServer(serverInvitURL.value)
}

</script>

<template>
    <div class="about">
        <h1>Server page</h1>
        <input type="char" v-model="serverInvitURL" />
        <button @click="addServer">Click to add server !</button>
        <ServerList />
    </div>
</template>
