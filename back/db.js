import { Sequelize, DataTypes } from 'sequelize'
export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './dbmBreak.db',
    logging: false
})
export const User = sequelize.define('User', {
    discordIdentifier: { type: DataTypes.STRING, unique: true, allowNull: false },
    username: { type: DataTypes.STRING, unique: false, allowNull: true },
    defaultAmount: { type: DataTypes.INTEGER, unique: false, allowNull: true },
    defaultTime: { type: DataTypes.TINYINT, unique: false, allowNull: true },
    role: { type: DataTypes.ENUM('admin', 'host', 'player'), defaultValue: 'player' },
    externalID: { type: DataTypes.STRING, unique: true, allowNull: false },
})
export const AuthSession = sequelize.define('AuthSession', {
    sessionUUID: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, unique: true, allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
})
export const Server = sequelize.define('Server', {
    discordIdentifier: { type: DataTypes.STRING, unique: true, allowNull: false },
    name: { type: DataTypes.STRING, unique: false, allowNull: false },
    iconData: { type: DataTypes.BLOB('long'), allowNull: true },
    authorized: { type: DataTypes.BOOLEAN, default: true },
})
export const GameSession = sequelize.define('GameSession', {
    rollMax: { type: DataTypes.INTEGER, unique: false, allowNull: false },
    time: { type: DataTypes.TINYINT, unique: false, allowNull: true },
})
export const Round = sequelize.define('Round', {
})
export const Roll = sequelize.define('Roll', {
    result: { type: DataTypes.INTEGER, allowNull: false }
})
User.belongsToMany(Server, { through: 'UserServer' })
Server.belongsToMany(User, { through: 'UserServer' })

AuthSession.belongsTo(User)

GameSession.belongsTo(User)
User.hasMany(GameSession)
GameSession.belongsTo(Server)
Server.hasMany(GameSession)
Round.belongsTo(GameSession)
GameSession.hasMany(Round)

Round.hasMany(Roll)
Roll.belongsTo(Round)

Round.belongsToMany(User, { through: 'RoundUser' })
User.belongsToMany(Round, { through: 'RoundUser' })

Roll.belongsTo(User)
User.hasMany(Roll)

export async function initDB() {
    await sequelize.sync({ alter: true }) // crée ou met à jour les tables
}
