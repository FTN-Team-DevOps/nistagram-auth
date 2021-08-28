import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWTPayloadDTO } from '../dto/jwt-payload.dto';
import { Auth, AuthDocument } from '../auth.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(Auth.name) private readonly authModel: Model<AuthDocument>,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getJWTSecret(),
    });
  }

  async validate(payload: JWTPayloadDTO): Promise<Auth> {
    const auth = await this.authModel.findOne({
      user: payload.user,
    });
    if (!auth) {
      throw new UnauthorizedException();
    }
    return auth;
  }
}
