import { pool } from "../config/database.js"

const sortColumns = {
  player: "players.player_name",
  team: "players.team",
  matches: "matches_played",
  goals: "total_goals",
  assists: "total_assists",
  rating: "average_rating",
} as const

export type RankingSort = keyof typeof sortColumns
export type RankingSortOrder = "asc" | "desc"

export function isRankingSort(value: string): value is RankingSort {
  return value in sortColumns
}

export async function findRankings(sortBy: RankingSort, sortOrder: RankingSortOrder) {
  const sortColumn = sortColumns[sortBy]

  const result = await pool.query(
    `SELECT
       players.player_id, players.player_name, players.team,
       COUNT(performances.id) AS matches_played,
       COALESCE(SUM(performances.goals), 0) AS total_goals,
       COALESCE(SUM(performances.assists), 0) AS total_assists,
       ROUND(AVG(performances.player_rating), 2) AS average_rating
     FROM players
     JOIN performances ON players.player_id = performances.player_id
     GROUP BY players.player_id, players.player_name, players.team
     ORDER BY ${sortColumn} ${sortOrder} NULLS LAST, players.player_name ASC
     LIMIT 10`,
  )

  return result.rows
}
