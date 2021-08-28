import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';
import * as bcrypt from 'bcrypt';
import { JWTPayloadDTO } from './dto/jwt-payload.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument, TRole } from './auth.model';
import { Model } from 'mongoose';
import { AuthCreateDTO } from './dto/auth-create.dto';
import { UserLoginDTO } from './dto/user-login.dto';
import { AuthUpdateDTO } from './dto/auth-update.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private readonly authModel: Model<AuthDocument>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.configService.getSaltRounds());
  }

  public comparePassword(
    passwordAttemt: string,
    password: string,
  ): Promise<boolean> {
    return bcrypt.compare(passwordAttemt, password);
  }

  public createJWTToken(payload: JWTPayloadDTO): string {
    return this.jwtService.sign(payload);
  }

  public async create(auth: AuthCreateDTO): Promise<Auth> {
    const password = await this.hashPassword(auth.password);
    const token = this.createJWTToken({
      role: auth.role,
      user: auth.user,
    });
    return this.authModel.create({ ...auth, password, token });
  }

  public async update(user: string, authDTO: AuthUpdateDTO): Promise<Auth> {
    const auth = await this.authModel.findOne({
      user,
    });
    if (!auth) {
      throw new NotFoundException();
    }

    const params: {
      password?: string;
      email?: string;
      role?: TRole;
      token?: string;
    } = { ...authDTO };

    if (authDTO.password) {
      params.password = await this.hashPassword(authDTO.password);
      params.token = this.createJWTToken({
        role: auth.role,
        user: auth.user,
      });
    }

    if (authDTO.role) {
      params.token = this.createJWTToken({
        role: authDTO.role,
        user: auth.user,
      });
    }

    return this.authModel.findOneAndUpdate(
      { _id: auth._id },
      { $set: params },
      { new: true },
    );
  }

  public async login(userCredentials: UserLoginDTO): Promise<Auth> {
    const auth = await this.authModel.findOne({ email: userCredentials.email });
    if (!auth) {
      throw new BadRequestException('Bad credentials!');
    }
    const passwordMatched = await this.comparePassword(
      userCredentials.password,
      auth.password,
    );
    if (!passwordMatched) {
      throw new BadRequestException('Bad credentials!');
    }

    return auth;
  }

  public async checkPermission(token: string, role: TRole): Promise<boolean> {
    const auth = await this.authModel.findOne({ token });
    if (!auth) {
      return false;
    }

    if (auth.role === 'admin') {
      return true;
    }

    return auth.role === role;
  }

  public async ifMy(token: string, user: string): Promise<boolean> {
    const auth = await this.authModel.findOne({ token });
    if (!auth) {
      return false;
    }
    if (auth.role === 'admin') {
      return true;
    }
    return auth.user.toString() === user;
  }

  public async getByToken(token: string): Promise<Auth> {
    const auth = await this.authModel.findOne({ token });
    if (!auth) {
      throw new NotFoundException();
    }
    return auth;
  }
}
