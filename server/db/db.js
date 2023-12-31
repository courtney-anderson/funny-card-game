import knex from 'knex'
import knexfile from './knexfile.js'

const environment = process.env.NODE_ENV || 'development'
const config = knexfile[environment]
export const connection = knex(config)

export async function getCards() {
  const numberOfEntries = 1
  const randomEntries = await connection('start-card')
    .select()
    .orderByRaw('RANDOM()')
    .limit(numberOfEntries)
  return randomEntries
}

export async function getAnswers() {
  const numberOfEntries = 4
  const randomEntries = await connection('answers')
    .select()
    .orderByRaw('RANDOM()')
    .limit(numberOfEntries)
  return randomEntries
}

export async function createGameRoom(user, userDisplayName, gameRoomData) {
  return await connection('gameRooms').insert(gameRoomData)
  // return addPlayerToGameRoom(user, userDisplayName, gameRoomId[0])
}

export async function addPlayerToGameRoom(user, userDisplayName, gameRoomId) {
  console.log(userDisplayName)
  const data = {
    userId: user.sub,
    gameRoomId: gameRoomId,
    username: userDisplayName,
  }
  return connection('players').insert(data)
}

export async function joinGame(user, roomName, password, userDisplayName) {
  try {
    const gameRoomId = await connection('gameRooms')
      .select('id')
      .where('name', roomName)
      .andWhere('password', password)
    return addPlayerToGameRoom(user, userDisplayName, gameRoomId[0].id)
  } catch (err) {
    return null
  }
}
