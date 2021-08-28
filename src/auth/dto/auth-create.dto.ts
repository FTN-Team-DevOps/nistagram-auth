import { TRole } from '../auth.model';

export class AuthCreateDTO {
  user: string; //IUser['id']
  password: string;
  email: string;
  role: TRole;
}
