import { TRole } from '../auth.model';

export class AuthUpdateDTO {
  password?: string;
  email?: string;
  role?: TRole;
}
