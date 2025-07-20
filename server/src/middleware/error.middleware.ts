import type { Request, Response, NextFunction } from "express"

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err)
  
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
  })
}

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
    error: `Cannot ${req.method} ${req.path}`,
  })
}
