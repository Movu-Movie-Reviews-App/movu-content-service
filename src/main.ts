
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common/services/logger.service';
import { Transport } from '@nestjs/microservices/enums/transport.enum';
import { MicroserviceOptions } from '@nestjs/microservices/interfaces/microservice-configuration.interface';
import { envs } from './config';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {

  const logger = new Logger('Content Microservice')

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.NATS,
    options: {
      servers: envs.natsServers
    }
  });

  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
      forbidNonWhitelisted: true
    }
  ));

  await app.listen();
  logger.log(`User microservice is running on port ${envs.port}`);

}
bootstrap();
