import { Response, NextFunction } from 'express';
import { DatabaseService } from './database.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class DatabaseController {
  public static async getTables(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tables = await DatabaseService.getTables();
      res.status(200).json({
        success: true,
        data: tables,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getTableData(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tableName = req.params.name;
      const data = await DatabaseService.getTableData(tableName);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async query(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sql } = req.body;
      const result = await DatabaseService.executeQuery(sql);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
