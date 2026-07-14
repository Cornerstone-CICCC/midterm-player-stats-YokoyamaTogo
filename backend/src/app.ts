import "dotenv/config"
import cors from "cors"
import express from "express"
import { playerRouter } from "./routes/playerRoutes.js"

export const app = express()

app.use(
  cors({
    origin: "http://localhost:4321",
  }),
)
app.use(express.json())

app.use("/api/players", playerRouter)
