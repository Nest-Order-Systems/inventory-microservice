import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  const logger = new Logger('Main');

  console.log(envs.natsServers)
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: envs.natsServers
      }
    }
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove all not incluide in the DTOs
      forbidNonWhitelisted: true, // return bad request if has properties in the object not required
    })
  );

  await app.listen();
  logger.log(`Inventory Microservices running on port ${envs.port}`)
}
bootstrap();
