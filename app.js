const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()

const dbPath = path.join(__dirname, 'cricketTeam.db')
let db = null

app.use(express.json())

const initDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server is running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`Error: ${e.message}`)
    process.exit(1)
  }
}

initDBAndServer()

//api1
app.get('/players/', async (request, response) => {
  const getAllPlayersQuery = `SELECT * FROM cricket_team;`
  const players = await db.all(getAllPlayersQuery)

  const ans = players => {
    return {
      playerId: players.player_id,
      playerName: players.player_name,
      jerseyNumber: players.jersey_number,
      role: players.role,
    }
  }
  response.send(players.map(eachPlayer => ans(eachPlayer)))
  // return players
})

//api2
app.post('/players/', async (request, response) => {
  const playerInfo = request.body
  const {playerName, jerseyNumber, role} = playerInfo
  const postPlayerQuery = `
  INSERT INTO cricket_team(player_name,jersey_number,role)
  VALUES('${playerName}',${jerseyNumber},'${role}')
  ;`
  await db.get(postPlayerQuery)
  response.send('Player Added to Team')
  // return 'Player Added to Team'
})

//api3
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayerQuery = `
  SELECT *
  FROM cricket_team
  WHERE player_Id = ${playerId};`
  const particularPlayer = await db.get(getPlayerQuery)

  response.send({
    playerId: particularPlayer.player_id,
    playerName: particularPlayer.player_name,
    jerseyNumber: particularPlayer.jersey_number,
    role: particularPlayer.role,
  })
  // return particularPlayer
})

//api4
app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerInfo = request.body
  const {playerName, jerseyNumber, role} = playerInfo

  const updatePlayerQuery = `
    UPDATE cricket_team
    SET
      player_name = '${playerName}',
      jersey_number = ${jerseyNumber},
      role = '${role}'
    WHERE
      player_id = ${playerId};
  `
  await db.get(updatePlayerQuery)
  response.send('Player Details Updated')
  // return 'Player Details Updated'
})

//api5
app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const deletePlayerQuery = `
  DELETE 
  FROM cricket_team
  WHERE player_Id = ${playerId};`
  await db.run(deletePlayerQuery)
  response.send('Player Removed')
  // return 'Player Removed'
})

module.exports = app
