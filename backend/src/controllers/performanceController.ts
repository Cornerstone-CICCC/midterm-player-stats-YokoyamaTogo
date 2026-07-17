import type { NextFunction, Request, Response } from "express"
import { parsePositiveInteger } from "../lib/parsePositiveInteger.js"
import {
  type PerformanceInput,
  countPerformances,
  createPerformance,
  deletePerformance,
  findPerformanceById,
  findPerformances,
  isPerformanceSort,
  type SortOrder,
  updatePerformance,
} from "../models/performanceModel.js"

const DEFAULT_LIMIT = 25
const MAX_LIMIT = 100

function getPerformanceId(value: string | string[] | undefined) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

export async function getPerformances(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = Math.min(parsePositiveInteger(req.query.limit, DEFAULT_LIMIT), MAX_LIMIT)
    const page = parsePositiveInteger(req.query.page, 1)
    const search = typeof req.query.search === "string" ? req.query.search : ""
    const requestedSort = typeof req.query.sortBy === "string" ? req.query.sortBy : "matchDate"
    const sortBy = isPerformanceSort(requestedSort) ? requestedSort : "matchDate"
    const sortOrder: SortOrder = req.query.sortOrder === "asc" ? "asc" : "desc"
    const offset = (page - 1) * limit
    const performances = await findPerformances(limit, offset, search, sortBy, sortOrder)
    const total = await countPerformances(search)

    res.json({
      data: performances,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      sort: { by: sortBy, order: sortOrder },
    })
  } catch (error) {
    next(error)
  }
}

export async function getPerformanceById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = getPerformanceId(req.params.id)

    if (!id) {
      res.status(400).json({ message: "A valid performance ID is required" })
      return
    }

    const performance = await findPerformanceById(id)

    if (!performance) {
      res.status(404).json({ message: "Performance not found" })
      return
    }

    res.json({ data: performance })
  } catch (error) {
    next(error)
  }
}

export async function postPerformance(req: Request, res: Response, next: NextFunction) {
  try {
    const performance = req.body as PerformanceInput

    if (!performance.playerId || !performance.matchId) {
      res.status(400).json({ message: "playerId and matchId are required" })
      return
    }

    const id = await createPerformance(performance)
    const createdPerformance = await findPerformanceById(id)
    res.status(201).json({ data: createdPerformance })
  } catch (error) {
    next(error)
  }
}

export async function putPerformance(req: Request, res: Response, next: NextFunction) {
  try {
    const id = getPerformanceId(req.params.id)

    if (!id) {
      res.status(400).json({ message: "A valid performance ID is required" })
      return
    }

    const updated = await updatePerformance(id, req.body as PerformanceInput)

    if (!updated) {
      res.status(404).json({ message: "Performance not found" })
      return
    }

    const performance = await findPerformanceById(id)
    res.json({ data: performance })
  } catch (error) {
    next(error)
  }
}

export async function removePerformance(req: Request, res: Response, next: NextFunction) {
  try {
    const id = getPerformanceId(req.params.id)

    if (!id) {
      res.status(400).json({ message: "A valid performance ID is required" })
      return
    }

    const deleted = await deletePerformance(id)

    if (!deleted) {
      res.status(404).json({ message: "Performance not found" })
      return
    }

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
