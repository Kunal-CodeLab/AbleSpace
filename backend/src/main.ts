import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

let cachedServer: any;

async function bootstrapServer() {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
    cachedServer = app.getHttpAdapter().getInstance();
  }
  return cachedServer;
}

// Serverless Handler for Vercel Runtimes
export default async function handler(req: any, res: any) {
  const server = await bootstrapServer();
  return server(req, res);
}

// Local Standalone Execution
if (!process.env.VERCEL) {
  async function bootstrapLocal() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 NestJS Backend running on http://localhost:${port}`);
  }
  bootstrapLocal();
}
