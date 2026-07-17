import { pool } from "../config/database.js"

export type PerformanceInput = {
  playerId?: string
  matchId?: string
  opponentTeam?: string
  matchResult?: string
  goalsTeam?: number
  goalsOpponent?: number
  minutesPlayed?: number
  goals?: number
  assists?: number
  shots?: number
  shotsOnTarget?: number
  keyPasses?: number
  successfulDribbles?: number
  successfulCrosses?: number
  tackles?: number
  interceptions?: number
  blocks?: number
  clearances?: number
  aerialDuelsWon?: number
  aerialDuelsLost?: number
  foulsCommitted?: number
  foulsSuffered?: number
  distanceCoveredKm?: number
  sprintDistanceKm?: number
  topSpeedKmh?: number
  accelerations?: number
  decelerations?: number
  staminaScore?: number
  playerRating?: number
  performanceScore?: number
  offensiveContribution?: number
  defensiveContribution?: number
}

const performanceColumns = `
  opponent_team, match_result, goals_team, goals_opponent, minutes_played,
  goals, assists, shots, shots_on_target, key_passes, successful_dribbles,
  successful_crosses, tackles, interceptions, blocks, clearances,
  aerial_duels_won, aerial_duels_lost, fouls_committed, fouls_suffered,
  distance_covered_km, sprint_distance_km, top_speed_kmh, accelerations,
  decelerations, stamina_score, player_rating, performance_score,
  offensive_contribution, defensive_contribution
`

const performanceSortColumns = {
  player: "players.player_name",
  team: "players.team",
  opponent: "performances.opponent_team",
  matchDate: "matches.match_date",
  position: "players.position",
  minutes: "performances.minutes_played",
  goals: "performances.goals",
  assists: "performances.assists",
  shots: "performances.shots",
  passAccuracy: "performances.pass_accuracy",
  rating: "performances.player_rating",
} as const

export type PerformanceSort = keyof typeof performanceSortColumns
export type SortOrder = "asc" | "desc"

export function isPerformanceSort(value: string): value is PerformanceSort {
  return value in performanceSortColumns
}

function performanceValues(performance: PerformanceInput) {
  return [
    performance.opponentTeam,
    performance.matchResult,
    performance.goalsTeam,
    performance.goalsOpponent,
    performance.minutesPlayed,
    performance.goals,
    performance.assists,
    performance.shots,
    performance.shotsOnTarget,
    performance.keyPasses,
    performance.successfulDribbles,
    performance.successfulCrosses,
    performance.tackles,
    performance.interceptions,
    performance.blocks,
    performance.clearances,
    performance.aerialDuelsWon,
    performance.aerialDuelsLost,
    performance.foulsCommitted,
    performance.foulsSuffered,
    performance.distanceCoveredKm,
    performance.sprintDistanceKm,
    performance.topSpeedKmh,
    performance.accelerations,
    performance.decelerations,
    performance.staminaScore,
    performance.playerRating,
    performance.performanceScore,
    performance.offensiveContribution,
    performance.defensiveContribution,
  ]
}

export async function findPerformances(
  limit: number,
  offset: number,
  search: string,
  sortBy: PerformanceSort,
  sortOrder: SortOrder,
) {
  const sortColumn = performanceSortColumns[sortBy]

  const result = await pool.query(
    `SELECT
       performances.id, performances.player_id, performances.match_id,
       players.player_name, players.team, players.position,
       performances.opponent_team, matches.match_date,
       performances.minutes_played, performances.goals, performances.assists,
       performances.shots, performances.pass_accuracy, performances.player_rating
     FROM performances
     JOIN players ON performances.player_id = players.player_id
     JOIN matches ON performances.match_id = matches.match_id
     WHERE players.player_name ILIKE $1
     ORDER BY ${sortColumn} ${sortOrder} NULLS LAST, performances.id ASC
     LIMIT $2 OFFSET $3`,
    [`%${search}%`, limit, offset],
  )

  return result.rows
}

export async function countPerformances(search: string) {
  const result = await pool.query<{ count: string }>(
    `SELECT COUNT(*)
     FROM performances
     JOIN players ON performances.player_id = players.player_id
     WHERE players.player_name ILIKE $1`,
    [`%${search}%`],
  )

  return Number(result.rows[0].count)
}

export async function findPerformanceById(id: number) {
  const result = await pool.query(
    `SELECT
       performances.id, performances.player_id, performances.match_id,
       players.player_name, players.team, players.jersey_number, players.position,
       matches.match_date, matches.stadium, matches.city, matches.tournament_stage,
       ${performanceColumns}
     FROM performances
     JOIN players ON performances.player_id = players.player_id
     JOIN matches ON performances.match_id = matches.match_id
     WHERE performances.id = $1`,
    [id],
  )

  return result.rows[0] ?? null
}

export async function createPerformance(performance: PerformanceInput) {
  const result = await pool.query<{ id: number }>(
    `INSERT INTO performances (
       player_id, match_id, ${performanceColumns}
     ) VALUES (
       $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
       $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28,
       $29, $30, $31, $32
     ) RETURNING id`,
    [performance.playerId, performance.matchId, ...performanceValues(performance)],
  )

  return result.rows[0].id
}

export async function updatePerformance(id: number, performance: PerformanceInput) {
  const result = await pool.query(
    `UPDATE performances SET
       opponent_team = $1, match_result = $2, goals_team = $3, goals_opponent = $4,
       minutes_played = $5, goals = $6, assists = $7, shots = $8,
       shots_on_target = $9, key_passes = $10, successful_dribbles = $11,
       successful_crosses = $12, tackles = $13, interceptions = $14, blocks = $15,
       clearances = $16, aerial_duels_won = $17, aerial_duels_lost = $18,
       fouls_committed = $19, fouls_suffered = $20, distance_covered_km = $21,
       sprint_distance_km = $22, top_speed_kmh = $23, accelerations = $24,
       decelerations = $25, stamina_score = $26, player_rating = $27,
       performance_score = $28, offensive_contribution = $29,
       defensive_contribution = $30
     WHERE id = $31`,
    [...performanceValues(performance), id],
  )

  return (result.rowCount ?? 0) > 0
}

export async function deletePerformance(id: number) {
  const result = await pool.query("DELETE FROM performances WHERE id = $1", [id])
  return (result.rowCount ?? 0) > 0
}
