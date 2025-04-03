import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger'; 

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, ip } = req;
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      const { statusCode } = res;
      const userAgent = req.get('user-agent') || '';

      logger.info(
        `${method} ${url} ${statusCode} - ${duration}ms | IP: ${ip} | User-Agent: ${userAgent}`,
      );
    });

    next();
  }
}
