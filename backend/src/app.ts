import "dotenv/config"
import cors from "cors"
import express from "express"

export const app = express()

app.use(
  cors({
    origin: "http://localhost:4321",
  }),
)
app.use(express.json())

