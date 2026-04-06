<script setup>

import { useSessionStore } from '@/stores/session'

const session = useSessionStore()

function login() {
    session.loginWithDiscord()
}
</script>

<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <RouterLink class="navbar-brand" to="/">DBM Break</RouterLink>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/">Home</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/about">About</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/gamble">Gamble !</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/server">Server</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/session">Session</RouterLink>
                    </li>
                </ul>
                <ul class="navbar-nav me-auto mb-2 mb-lg-0 justify-content-end" style="flex-grow: inherit">
                    <li class="nav-item">
                        <button @click="login">Connexion</button>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <RouterView />
</template>