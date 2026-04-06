import cors from 'cors'
import express from 'express'
import { initDB, User, Server, AuthSession, GameSession, Round, Roll } from './db.js'
import { where } from 'sequelize';
import dotenv from 'dotenv'
import axios from 'axios'
import cookieParser from 'cookie-parser'



/*---------------*/
/* SERVER CONFIG */
/*---------------*/
dotenv.config()
const apiUrl = "/api"
const app = express();
const port = 8080;
app.use(cors({
    origin: process.env.FRONT_URL,
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

/*---------------*/
/* LOGIC FUNCTIONS */
/*---------------*/
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/*---------------*/
/* DB FUNCTIONS */
/*---------------*/
await initDB()
async function createServer(discordIdentifier) {
    await Server.create({ discordIdentifier: discordIdentifier })
}

/*---------------*/
/* SERVER ROUTES */
/*---------------*/
app.get('/', (req, res) => {
    res.send('Hello World from Express!');
});

// DISCORD CONNEXION

// First route to securely redirect user to the oauth2 discord authentification
app.get(apiUrl + '/auth/discord', async (req, res) => {
    const state = crypto.randomUUID()

    res.cookie('oauth_state', state, {
        httpOnly: true,
        sameSite: 'lax'
    })

    const params = new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
        response_type: 'code',
        scope: 'identify',
        state
    })

    res.redirect(`https://discord.com/oauth2/authorize?${params}`)
})

//oauth2 discord callback, create user and session and redirect to the front
app.get(apiUrl + '/auth/discord/callback', async (req, res) => {
    const { code, state } = req.query
    const storedState = req.cookies.oauth_state
    if (!code || state !== storedState) {
        return res.sendStatus(400)
    }

    /* AUTH DISCORD APP
    all variables here are the app ones, except code
    code is acquired via the front, and it's the only 
    variable that defines user */
    const tokenRes = await axios.post(
        'https://discord.com/api/oauth2/token',
        new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            redirect_uri: process.env.DISCORD_REDIRECT_URI,
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )

    // from here, we have the client token, we can use it to perform operations for him, such as @me
    const { access_token } = tokenRes.data

    const userRes = await axios.get(
        'https://discord.com/api/users/@me',
        { headers: { Authorization: `Bearer ${access_token}` } }
    )

    const discordUser = userRes.data

    console.log(discordUser.username)
    const [user] = await User.findOrCreate({
        where: { discordIdentifier: discordUser.id },
        defaults: { username: discordUser.username, externalID: crypto.randomUUID() },
    })
    console.log(user.id)
    // now we'll create a session cookie
    const expiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
    )
    const session = await AuthSession.create({ UserId: user.id, expiresAt: expiresAt })

    res.cookie('session', session.sessionUUID, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
    })

    res.redirect('http://localhost:5173')
})

// AUTH MIDDLEWARE
// middleware, placed on all auth required routes, make sure the user session is OK
export async function requireAuth(req, res, next) {
    const token = req.cookies.session
    if (!token) return res.sendStatus(401)

    const session = await AuthSession.findOne({
        where: { sessionUUID: token },
        include: User
    })

    if (!session) return res.sendStatus(401)
    if (session.expiresAt < new Date()) {
        await session.destroy()
        return res.sendStatus(401)
    }

    // user is injected in req, we can use it in methods that use this middleware
    req.user = session.User
    next()
}

// POST
app.post(apiUrl + '/roll', [requireAuth], async (req, res) => {
    const result = randomIntFromInterval(1, 5)
    await Roll.create({ result, userId: req.user.id })
    res.send(result);
});

app.post(apiUrl + '/create/server', [requireAuth], async (req, res) => {
    const { serverInvitURL } = req.body
    const regex = /(?:discord\.gg\/|discord\.com\/invite\/)([a-zA-Z0-9]+)/
    const inviteCode = serverInvitURL.match(regex)?.[1]

    const apiRes = await axios.get(`https://discord.com/api/v10/invites/${inviteCode}?with_counts=true&with_expiration=true`)
    const guild = apiRes.data.guild
    // TODO: Verify guild datas
    // TODO: Verify if the server already exists
    // server creation and add user to it
    let iconData = null
    const iconUrl = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
    const iconRes = await axios.get(iconUrl, { responseType: 'arraybuffer' })
    iconData = Buffer.from(iconRes.data, 'binary')
    const result = await Server.create({ discordIdentifier: guild.id, name: guild.name, iconData: iconData })
    await result.addUser(req.user)
    res.send(result);
});

// GET 
app.get(apiUrl + '/list/server', [requireAuth], async (req, res) => {
    console.log(req)
    console.log(req.user)
    const result = await req.user.getServers()
    console.log(result)
    res.send(result);
});

/*---------------*/
/* SERVER LISTENING */
/*---------------*/
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});