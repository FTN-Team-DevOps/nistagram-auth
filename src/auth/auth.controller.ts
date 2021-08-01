import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Auth, TRole } from './auth.model';
import { AuthService } from './auth.service';
import { AuthCreateDTO } from './dto/auth-create.dto';
import { AuthUpdatePayloadDTO } from './dto/auth-update-payload.dto';
import { UserLoginDTO } from './dto/user-login.dto';

@Controller('/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth-log-in')
  async logIn(@Payload() payload: UserLoginDTO): Promise<Auth> {
    return await this.authService.login(payload);
  }

  @MessagePattern('auth-create')
  async create(@Payload() payload: AuthCreateDTO): Promise<Auth> {
    return await this.authService.create(payload);
  }

  @MessagePattern('auth-update')
  async update(@Payload() payload: AuthUpdatePayloadDTO): Promise<Auth> {
    return await this.authService.update(payload.user, payload.data);
  }

  @MessagePattern('auth-check-permission')
  async checkPermission(
    @Payload() payload: { token: string; role: TRole },
  ): Promise<boolean> {
    return await this.authService.checkPermission(payload.token, payload.role);
  }

  @MessagePattern('auth-if-my')
  async ifMy(
    @Payload() payload: { token: string; user: string },
  ): Promise<boolean> {
    return await this.authService.ifMy(payload.token, payload.user);
  }
}
