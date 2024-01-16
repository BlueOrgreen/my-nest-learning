import { CustomRepository } from '@/modules/database/decorators';
import { PostEntity } from '../entities/post.entity';
import { CommentEntity } from '../entities';
import { BaseRepository } from '@/modules/database/base';

@CustomRepository(PostEntity)
export class PostRepository extends BaseRepository<PostEntity> {
    protected _qbName = 'post';

    /**
     * 在查询文章时一般我们需要显示评论数量以及其关联的分类，所以需要修改PostRepository 评论数量
     * 是通过添加一个子查询把该篇文章关联的评论的数量先通过select查询出来，然后通过
     * loadRelationCountAndMap映射到该篇文章的commentCount虚拟字段上
     */
    buildBaseQB() {
        return this.createQueryBuilder(this.qbName)
            .leftJoinAndSelect(`${this.qbName}.category`, 'category')
            .leftJoinAndSelect('post.tags', 'tags')
            .addSelect((subQuery) => {
                return subQuery
                    .select('COUNT(c.id)', 'count')
                    .from(CommentEntity, 'c')
                    .where(`c.post.id = ${this.qbName}.id`);
            }, 'commentCount')
            .loadRelationCountAndMap(`${this.qbName}.commentCount`, `${this.qbName}.comments`);;
        }
}