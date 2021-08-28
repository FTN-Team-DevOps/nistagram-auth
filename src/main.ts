import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.AMQP_URL],
      queue: 'auth_queue',
      queueOptions: {
        durable: false,
      },
    },
  });
  app
    .startAllMicroservices(() => {
      Logger.log('Microservice is listening!');
    })
    .listen(3000, () => {
      Logger.log('Api Server is listening on 3000');
    });
}

bootstrap();
