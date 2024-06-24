import { Request } from 'express';

export interface OptionalAuthenticatedRequest extends Request {
  readonly user?:
    | {
        readonly id: string;
        readonly sessionId: string;
      }
    | undefined;
}
