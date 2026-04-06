<script setup>

import { useSessionStore } from '@/stores/session'

const session = useSessionStore()

function roll() {
    session.roll()
}
</script>

<template>
    <div class="about">
        <h1>This is the gambler page</h1>
        <button @click="roll">Click to roll !</button>
    </div>
</template>
