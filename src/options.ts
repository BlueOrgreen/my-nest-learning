// src/options.ts
import { NestFactory } from '@nestjs/core';

import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import * as configs from './config';
import { ContentModule } from './modules/content/content.module';
import { CreateOptions } from './modules/core/types';
import { DatabaseModule } from './modules/database/database.module';
import { MeilliModule } from './modules/meilisearch/melli.module';
import { Restful } from './modules/restful/restful';
import { RestfulModule } from './modules/restful/restful.module';

export const createOptions: CreateOptions = {
    config: { factories: configs as any, storage: { enabled: true } },
    modules: async (configure) => {
        return [
            DatabaseModule.forRoot(configure),
            MeilliModule.forRoot(configure),
            RestfulModule.forRoot(configure),
            ContentModule.forRoot(configure),
        ];
    },
    globals: {},
    builder: async ({ configure, BootModule }) => {
        const container = await NestFactory.create<NestFastifyApplication>(
            BootModule,
            new FastifyAdapter(),
            {
                cors: true,
                logger: ['error', 'warn'],
            },
        );
        // 在此处构建swagger文档
        const restful = container.get(Restful);
        await restful.factoryDocs(container);

        return container;
    },
    commands: () => [],
};
