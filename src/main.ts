import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function start() {
  const PORT = process.env.PORT
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('Denwa HTTP routes')
    .setDescription('Description')
    .setVersion('0.1')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/api/docs', app, document)

  await app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`)
  })
}

start();
