import { Role } from '../enums/role.enum';

export interface AdminRequest extends Request {
  admin: {
    id: string;
    role: Role;
  };
}
