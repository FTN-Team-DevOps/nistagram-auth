import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller('/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('log-in')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async myController(@Payload() data: any): Promise<string> {
    return await this.authService.test();
  }
}