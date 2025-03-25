import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  redis: Redis;
  constructor(private readonly configService: ConfigService) {
    this.redis = new Redis({
      port: configService.get('REDIS_PORT')
        ? parseInt(configService.get('REDIS_PORT') as string, 10)
        : 6379,
      host: configService.get('REDIS_HOST'),
      password: configService.get('REDIS_PASSWORD'),
    });
  }

  async setKey(key: string, value: any, time: number) {
    await this.redis.setex(key, time, JSON.stringify(value));
  }
  async getKey(key: string) {
    return await this.redis.get(key);
  }
  async delKey(key: string) {
    await this.redis.del(key);
  }
  async createToken(email: string) {
    const token = crypto.randomUUID();
    const emailTokenKey = `email-tokens:${email}`;
    const verificationKey = `verification-email:${token}`;

    const getOldToken = await this.getKey(emailTokenKey);
    if (getOldToken) {
      await this.delToken(JSON.parse(getOldToken));
    }

    await this.setKey(verificationKey, { email }, 3600);
    await this.setKey(emailTokenKey, token, 3600);
    return token;
  }
  async getToken(token: string) {
    return await this.getKey(`verification-email:${token}`);
  }
  async delToken(token: string) {
    return await this.delKey(`verification-email:${token}`);
  }
}
