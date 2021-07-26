import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqps://vfercydr:j1hUWYqCgZ730bD1sWHuvsM1WtuYjK8_@chimpanzee.rmq.cloudamqp.com/vfercydr`,
      ],
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
