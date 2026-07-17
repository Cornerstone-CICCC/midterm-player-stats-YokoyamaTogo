import type { NextFunction, Request, Response } from "express"
import { findRankings, isRankingSort, type RankingSortOrder } from "../models/rankingModel.js"

export async function getRankings(req: Request, res: Response, next: NextFunction) {
  try {
    const requestedSort = typeof req.query.sortBy === "string" ? req.query.sortBy : "goals"
    const sortBy = isRankingSort(requestedSort) ? requestedSort : "goals"
    const sortOrder: RankingSortOrder = req.query.sortOrder === "asc" ? "asc" : "desc"
    const rankings = await findRankings(sortBy, sortOrder)

    res.json({ data: rankings, sort: { by: sortBy, order: sortOrder } })
  } catch (error) {
    next(error)
  }
}
