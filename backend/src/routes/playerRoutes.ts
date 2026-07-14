import { Router } from "express"
import { getPlayerById, getPlayers } from "../controllers/playerController.js"

export const playerRouter = Router()

playerRouter.get("/", getPlayers)
playerRouter.get("/:playerId", getPlayerById)
