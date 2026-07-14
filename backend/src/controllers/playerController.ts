import type { Request, Response, NextFunction } from "express"
import { parsePositiveInteger } from "../lib/parsePositiveInteger.js"
import { countPlayers, findPlayerById, findPlayers } from "../models/playerModel.js"

const DEFAULT_LIMIT = 25
const MAX_LIMIT = 100

export async function getPlayers(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = Math.min(parsePositiveInteger(req.query.limit, DEFAULT_LIMIT), MAX_LIMIT)
    const page = parsePositiveInteger(req.query.page, 1)
    const offset = (page - 1) * limit
    const players = await findPlayers(limit, offset)
    const total = await countPlayers()

    res.json({
      data: players,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function getPlayerById(req: Request, res: Response, next: NextFunction) {
  try {
    const { playerId } = req.params

    if (!playerId || Array.isArray(playerId)) {
      res.status(400).json({ message: "A single player ID is required" })
      return
    }

    const player = await findPlayerById(playerId)

    if (!player) {
      res.status(404).json({ message: "Player not found" })
      return
    }

    res.json({ data: player })
  } catch (error) {
    next(error)
  }
}
