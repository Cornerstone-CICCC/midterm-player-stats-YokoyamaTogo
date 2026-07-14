import { Router } from "express"
import {
  getPerformanceById,
  getPerformances,
  postPerformance,
  putPerformance,
  removePerformance,
} from "../controllers/performanceController.js"

export const performanceRouter = Router()

performanceRouter.get("/", getPerformances)
performanceRouter.get("/:id", getPerformanceById)
performanceRouter.post("/", postPerformance)
performanceRouter.put("/:id", putPerformance)
performanceRouter.delete("/:id", removePerformance)
