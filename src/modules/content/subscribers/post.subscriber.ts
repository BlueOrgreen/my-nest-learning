import { DataSource, EventSubscriber } from 'typeorm';
import { SanitizeService } from '../services/sanitize.service';
import { PostEntity } from '../entities';
import { PostRepository } from '../repositories';
import { PostBodyType } from '../constants';

// src/modules/content/subscribers/post.subscriber.ts
@EventSubscriber()
export class PostSubscriber {
    constructor(
        protected dataSource: DataSource,
        protected sanitizeService: SanitizeService,
        protected postRepository: PostRepository,
    ) {}

    listenTo() {
        return PostEntity;
    }

    /**
     * 加载文章数据的处理
     * @param entity
     */
    async afterLoad(entity: PostEntity) {
        if (entity.type === PostBodyType.HTML) {
            entity.body = this.sanitizeService.sanitize(entity.body);
        }
    }
}
