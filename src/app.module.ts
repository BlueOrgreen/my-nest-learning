import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/database/database.module';
import { CoreModule } from './modules/core/core.module';
import { database, meilli } from './config';
import { AppFilter, AppIntercepter, AppPipe } from './modules/core/providers';
import { ContentModule } from './modules/content/content.module';
import { MeilliModule } from './modules/meilisearch/melli.module';


@Module({
    imports: [
        ContentModule.forRoot(),
        CoreModule.forRoot(),
        DatabaseModule.forRoot(database),
        MeilliModule.forRoot(meilli),
    ],
    providers: [
        {
            provide: APP_PIPE,
            useValue: new AppPipe({
                transform: true,
                whitelist: true,
                forbidNonWhitelisted: true,
                forbidUnknownValues: true,
                validationError: { target: false },
            }),
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: AppIntercepter,
        },
        {
            provide: APP_FILTER,
            useClass: AppFilter,
        }
    ],
})
export class AppModule {}