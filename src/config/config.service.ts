import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

@Injectable()
export class ConfigService {
  constructor() {
    dotenv.config();
  }

  static getDateFormat(): string {
    return 'YYYY-MM-DD';
  }

  static getTimeDateFormat(): string {
    return 'YYYY-MM-DD HH:mm';
  }

  static getMonthFormat(): string {
    return 'YYYY-MM';
  }

  getServerPort(): number {
    return +process.env.SERVER_PORT;
  }

  getPublicatonsRoute(): string {
    return process.env.PUBLICATION_ROUTE || '';
  }

  getJWTSecret(): string {
    return process.env.JWT_SECRET;
  }

  getSaltRounds(): number {
    return +process.env.SALT_ROUNDS || 10;
  }
}
