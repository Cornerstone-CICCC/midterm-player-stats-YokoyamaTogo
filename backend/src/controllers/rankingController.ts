import type { NextFunction, Request, Response } from "express"
import { findRankings, isRankingSort } from "../models/rankingModel.js"

export async function getRankings(req: Request, res: Response, next: NextFunction) {
  try {
    const requestedSort = typeof req.query.sortBy === "string" ? req.query.sortBy : "goals"
    const sortBy = isRankingSort(requestedSort) ? requestedSort : "goals"
    const rankings = await findRankings(sortBy)

    res.json({ data: rankings, sortBy })
  } catch (error) {
    next(error)
  }
}
