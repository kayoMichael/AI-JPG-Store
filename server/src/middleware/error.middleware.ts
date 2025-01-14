import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', {
    error: err,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });
  res.status(500).json({
    message: 'An unexpected error occurred',
  });
};

export default errorHandler;
