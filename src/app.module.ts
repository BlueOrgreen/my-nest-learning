import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/database/database.module';
import { CoreModule } from './modules/core/core.module';
import { database } from './config';
import { ContentModule } from './modules/content/content.module';

@Module({
    imports: [
        ContentModule,
        CoreModule.forRoot(),
        DatabaseModule.forRoot(database),
    ],
    providers: [],
})
export class AppModule {}