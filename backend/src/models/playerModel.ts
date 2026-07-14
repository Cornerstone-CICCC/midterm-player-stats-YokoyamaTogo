import { pool } from "../config/database.js"

export type Player = {
  player_id: string
  player_name: string
  age: number | null
  nationality: string | null
  team: string | null
  jersey_number: number | null
  position: string | null
  height_cm: number | null
  weight_kg: number | null
  preferred_foot: string | null
  club_name: string | null
  market_value_eur: string | null
  total_goals_tournament: number | null
  total_assists_tournament: number | null
  total_minutes_tournament: number | null
  player_of_match_awards: number | null
  tournament_rating: string | null
}

const playerColumns = `
  player_id, player_name, age, nationality, team, jersey_number, position,
  height_cm, weight_kg, preferred_foot, club_name, market_value_eur,
  total_goals_tournament, total_assists_tournament, total_minutes_tournament,
  player_of_match_awards, tournament_rating
`

export async function findPlayers(limit: number, offset: number): Promise<Player[]> {
  const result = await pool.query<Player>(
    `SELECT ${playerColumns}
     FROM players
     ORDER BY player_name ASC
     LIMIT $1 OFFSET $2`,
    [limit, offset],
  )

  return result.rows
}

export async function countPlayers(): Promise<number> {
  const result = await pool.query<{ count: string }>("SELECT COUNT(*) FROM players")
  return Number(result.rows[0].count)
}

export async function findPlayerById(playerId: string): Promise<Player | null> {
  const result = await pool.query<Player>(
    `SELECT ${playerColumns}
     FROM players
     WHERE player_id = $1`,
    [playerId],
  )

  return result.rows[0] ?? null
}
