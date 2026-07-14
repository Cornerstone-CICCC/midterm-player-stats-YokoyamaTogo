import "dotenv/config"
import cors from "cors"
import express from "express"
import { playerRouter } from "./routes/playerRoutes.js"
import { performanceRouter } from "./routes/performanceRoutes.js"
import { rankingRouter } from "./routes/rankingRoutes.js"

export const app = express()

app.use(
  cors({
    origin: "http://localhost:4321",
  }),
)
app.use(express.json())

app.use("/api/players", playerRouter)
app.use("/api/performances", performanceRouter)
app.use("/api/rankings", rankingRouter)
