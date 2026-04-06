import { defineStore } from 'pinia'
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
})

export const useSessionStore = defineStore('session', {
    state: () => ({
        user: null,
        currentBets: [],
        isLoggedIn: false,
        servers: [],
    }),
    actions: {
        // async fetchUser() {
        //     try {
        //         const { data } = await api.get('/me')
        //         this.user = data.user
        //         this.balance = data.balance
        //         this.currentBets = data.currentBets
        //         this.isLoggedIn = true
        //     } catch {
        //         this.user = "Bob"
        //         this.isLoggedIn = true
        //     }
        // },
        async loginWithDiscord() {
            try {
                window.location.href = 'http://localhost:8080/api/auth/discord'
            } catch (err) {
                console.error('Error with login', err)
            }
        },
        async roll(bet) {
            try {
                const { data } = await api.post('/roll', bet)
                console.log(data)
            } catch (err) {
                console.error('Erreur au placement du pari', err)
            }
        },
        async addServer(serverInvitURL) {
            try {
                const { data } = await api.post('/create/server', { serverInvitURL: serverInvitURL })
                console.log(data)
            } catch (err) {
                console.error('Error trying to add server', err)
            }
        },
        async listServers() {
            try {
                const { data } = await api.get('/list/server')
                this.servers = data
            } catch (err) {
                console.error('Error trying to list servers', err)
            }
        },
        // async logout() {
        //     await api.post('/logout')
        //     this.$reset() 197030297030623230
        // }
    }
})
