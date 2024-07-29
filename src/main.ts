import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ZodValidationPipe } from "nestjs-zod";
import { ZodFilter } from "@/common/filters/zod.exception";
import { env } from "@/env";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
  );
  const config = new DocumentBuilder()
    .setTitle("plann.er")
    .setDescription(
      "Especificações da API para o back-end da aplicação plann.er",
    )
    .setVersion("1.0.0")
    .addTag("trips")
    .addTag("participants")
    .addTag("activities")
    .addTag("links")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  app.useGlobalPipes(new ZodValidationPipe())
  app.useGlobalFilters(new ZodFilter())

  if (env.NODE_ENV !== "development") {
    // app.enableCors();
    app.setGlobalPrefix('api/v1');
  }

  await app.listen(env.PORT, "0.0.0.0");
}
bootstrap();
