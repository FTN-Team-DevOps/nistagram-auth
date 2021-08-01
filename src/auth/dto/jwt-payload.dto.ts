import { TRole } from '../auth.model';

export class JWTPayloadDTO {
  user: string;
  role: TRole;
}
