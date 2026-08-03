import { Response, NextFunction } from 'express';
import { RealtimeService } from './realtime.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class RealtimeController {
  public static async listChannels(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const channels = await RealtimeService.listChannels();
      res.status(200).json({
        success: true,
        data: channels,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async broadcast(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { channel, event, payload } = req.body;
      const result = await RealtimeService.broadcastMessage(channel || 'global:presence', event || 'ping', payload || {});
      res.status(200).json({
        success: true,
        message: 'Event broadcasted to channel subscribers',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
