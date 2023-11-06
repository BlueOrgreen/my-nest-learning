import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { Module } from '@nestjs/common'
import { PostController } from './controllers';
import { PostEntity } from './entities';
import { PostRepository } from './repositories';
import { PostService, SanitizeService } from './services';
import { PostSubscriber } from './subscribers';


@Module({
    imports: [
        TypeOrmModule.forFeature([PostEntity]),
        DatabaseModule.forRepository([PostRepository]),
    ],
    controllers: [PostController],
    providers: [PostService, PostSubscriber, SanitizeService],
    exports: [PostService, DatabaseModule.forRepository([PostRepository])],
})
export class ContentModule {
    
}