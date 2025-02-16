import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, NextFunction, Request, Response } from 'express';
import { writeFile } from 'fs';
import helmet from 'helmet';
import { DeveloperModule } from './dev.module';
import { PlainLogger } from './utilities/PlainLogger';

async function bootstrap() {
  let app: NestExpressApplication;

  if (process.env.NODE_ENV === 'prod') {
    app = await NestFactory.create(DeveloperModule, { bufferLogs: true });
  } else {
    new Logger('BOOTSTRAP').warn(
      `In Developer mode the seeding APIs are enabled.`,
    );

    app = await NestFactory.create(DeveloperModule, { bufferLogs: true });

    if (process.env.SWAGGER) {
      const config = new DocumentBuilder()
        .setTitle('Demo Project')
        .setDescription('The Demo Project API description')
        .setVersion('0.1')
        .build();
      const specFile = `${__dirname}/spec.json`;
      writeFile(
        specFile,
        JSON.stringify(SwaggerModule.createDocument(app, config)),
        () => {
          new Logger('APISpec').log(`OpenApi Spec written to ${specFile}`);
          new Logger('APISpec').log(
            `Can be viewed using https://editor.swagger.io/`,
          );
        },
      );
    }
  }
  // newrelic.instrumentLoadedModule("express", app);

  app.disable('x-powered-by');

  if (process.env.RICH_LOG !== '1') {
    app.useLogger(app.get(PlainLogger));
  }
  const accessLog = new Logger('Access Log', { timestamp: false });
  app.use((request: Request, response: Response, next: NextFunction) => {
    const {
      ip,
      method,
      originalUrl,
      headers: { ['x-forwarded-for']: forwardedFor },
    } = request;
    const startAt = process.hrtime();
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      const diff = process.hrtime(startAt);
      const responseTime = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);

      accessLog.log(
        `${method} ${originalUrl} ${statusCode} ${responseTime}ms ${contentLength} - ${userAgent} ${
          forwardedFor || ip
        }`,
      );
    });

    next();
  });

  if (process.env.INSECURE_CORS) {
    app.enableCors({ origin: '*', exposedHeaders: ['x-fresh-token'] });
  } else {
    app.enableCors({
      origin: [process.env.SYSTEM_URL, process.env.ESS_SYSTEM_URL],
      exposedHeaders: ['x-fresh-token'],
    });
    app.use(
      helmet({
        hsts: true,
        hidePoweredBy: true,
        crossOriginResourcePolicy: { policy: 'same-site' },
      }),
    );
  }
  app.getHttpAdapter().getInstance().set('etag', false);

  // this doesn't feel right :/
  app.use(json({ limit: '50mb' }));

  await app.listen(process.env.LISTEN_PORT || 80);
}

void bootstrap();
