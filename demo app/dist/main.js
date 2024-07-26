"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const messages_module_1 = require("./messages/messages.module");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const path_1 = require("path");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(messages_module_1.MessagesModule, new platform_fastify_1.FastifyAdapter());
    app.enableCors({
        origin: ['http://example.com', '*'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });
    app.useStaticAssets({
        root: (0, path_1.join)(__dirname, '..', 'public'),
        prefix: '/public/',
    });
    app.setViewEngine({
        engine: {
            pug: require('pug'),
        },
        templates: (0, path_1.join)(__dirname, '..', 'views'),
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Message example')
        .setDescription('The cats API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('swagger', app, document, {
        jsonDocumentUrl: 'swagger/json',
    });
    await app.listen(5000);
}
bootstrap();
//# sourceMappingURL=main.js.map